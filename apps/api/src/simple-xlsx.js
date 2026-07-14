"use strict";

const zlib = require("zlib");

function readWorkbook(buffer) {
  const files = readZipFiles(Buffer.from(buffer || []));
  const sharedStrings = parseSharedStrings(files.get("xl/sharedStrings.xml") || "");
  const rels = parseWorkbookRels(files.get("xl/_rels/workbook.xml.rels") || "");
  const sheets = parseWorkbookSheets(files.get("xl/workbook.xml") || "", rels);
  const result = { SheetNames: [], Sheets: {} };

  sheets.forEach((sheet) => {
    const xml = files.get(sheet.path);
    if (!xml) return;
    result.SheetNames.push(sheet.name);
    result.Sheets[sheet.name] = parseSheetRows(xml, sharedStrings);
  });

  return result;
}

function sheetToJson(sheet) {
  if (Array.isArray(sheet)) return sheet;
  return [];
}

function readZipFiles(buffer) {
  const eocdOffset = findEndOfCentralDirectory(buffer);
  if (eocdOffset < 0) throw new Error("XLSX merkezi dizini bulunamadı.");
  const entryCount = buffer.readUInt16LE(eocdOffset + 10);
  const centralOffset = buffer.readUInt32LE(eocdOffset + 16);
  const files = new Map();
  let offset = centralOffset;

  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) throw new Error("XLSX merkezi dizin kaydı bozuk.");
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString("utf8", offset + 46, offset + 46 + fileNameLength).replace(/\\/g, "/");
    const content = extractLocalFile(buffer, localOffset, method, compressedSize);
    files.set(name, content.toString("utf8"));
    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return files;
}

function findEndOfCentralDirectory(buffer) {
  for (let offset = buffer.length - 22; offset >= Math.max(0, buffer.length - 65557); offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) return offset;
  }
  return -1;
}

function extractLocalFile(buffer, offset, method, compressedSize) {
  if (buffer.readUInt32LE(offset) !== 0x04034b50) throw new Error("XLSX lokal dosya başlığı bozuk.");
  const fileNameLength = buffer.readUInt16LE(offset + 26);
  const extraLength = buffer.readUInt16LE(offset + 28);
  const dataOffset = offset + 30 + fileNameLength + extraLength;
  const data = buffer.subarray(dataOffset, dataOffset + compressedSize);
  if (method === 0) return data;
  if (method === 8) return zlib.inflateRawSync(data);
  throw new Error(`Desteklenmeyen XLSX sıkıştırma yöntemi: ${method}`);
}

function parseSharedStrings(xml) {
  if (!xml) return [];
  return [...xml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map((match) => {
    return [...match[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)]
      .map((item) => decodeXml(item[1]))
      .join("");
  });
}

function parseWorkbookRels(xml) {
  const rels = new Map();
  [...xml.matchAll(/<Relationship\b([^>]*)\/?>/g)].forEach((match) => {
    const attrs = parseAttributes(match[1]);
    if (!attrs.Id || !attrs.Target) return;
    const target = attrs.Target.startsWith("/") ? attrs.Target.slice(1) : `xl/${attrs.Target}`.replace(/\/[^/]+\/\.\.\//g, "/");
    rels.set(attrs.Id, target.replace(/\\/g, "/"));
  });
  return rels;
}

function parseWorkbookSheets(xml, rels) {
  return [...xml.matchAll(/<sheet\b([^>]*)\/?>/g)].map((match, index) => {
    const attrs = parseAttributes(match[1]);
    const relId = attrs["r:id"] || attrs.id || "";
    const fallbackPath = `xl/worksheets/sheet${index + 1}.xml`;
    return {
      name: decodeXml(attrs.name || `Sayfa ${index + 1}`),
      path: rels.get(relId) || fallbackPath
    };
  });
}

function parseSheetRows(xml, sharedStrings) {
  const rows = [];
  const rowMatches = [...xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)];
  const table = rowMatches.map((row) => {
    const values = [];
    [...row[1].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)].forEach((cell) => {
      const attrs = parseAttributes(cell[1]);
      const columnIndex = columnToIndex((attrs.r || "").replace(/\d+/g, ""));
      values[columnIndex] = readCellValue(attrs, cell[2], sharedStrings);
    });
    return values;
  });
  const headers = (table.shift() || []).map((value) => String(value || "").trim());
  table.forEach((values) => {
    const row = {};
    headers.forEach((header, index) => {
      if (!header) return;
      row[header] = values[index] === undefined ? "" : values[index];
    });
    if (Object.values(row).some((value) => String(value || "").trim())) rows.push(row);
  });
  return rows;
}

function readCellValue(attrs, body, sharedStrings) {
  const inline = body.match(/<is\b[^>]*>([\s\S]*?)<\/is>/);
  if (inline) {
    return [...inline[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((item) => decodeXml(item[1])).join("");
  }
  const value = (body.match(/<v\b[^>]*>([\s\S]*?)<\/v>/) || [])[1] || "";
  if (attrs.t === "s") return sharedStrings[Number(value)] || "";
  if (attrs.t === "str") return decodeXml(value);
  return decodeXml(value);
}

function parseAttributes(text) {
  const attrs = {};
  [...String(text || "").matchAll(/([:\w-]+)="([^"]*)"/g)].forEach((match) => {
    attrs[match[1]] = decodeXml(match[2]);
  });
  return attrs;
}

function columnToIndex(column) {
  const text = String(column || "").toUpperCase();
  let result = 0;
  for (let index = 0; index < text.length; index += 1) {
    result = result * 26 + (text.charCodeAt(index) - 64);
  }
  return Math.max(0, result - 1);
}

function decodeXml(value) {
  return String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(parseInt(code, 10)));
}

module.exports = { readWorkbook, sheetToJson };
