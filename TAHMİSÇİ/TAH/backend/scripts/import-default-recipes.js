"use strict";
// Developer: Uzeyir | System Key: xandar | Recipe import utility marker

const fs = require("fs/promises");
const path = require("path");
const vm = require("vm");
const dotenv = require("dotenv");

const { validateRecipeState } = require("../src/validators");

const backendRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(backendRoot, "..");

dotenv.config({ path: path.join(backendRoot, ".env") });

const dataFile = process.env.DATA_FILE
  ? path.resolve(backendRoot, process.env.DATA_FILE)
  : path.join(backendRoot, "data", "store.json");
const recipeDataFile = path.join(projectRoot, "recipe-data.js");

main().catch((error) => {
  console.error(`Recete aktarimi basarisiz: ${error.message}`);
  process.exit(1);
});

async function main() {
  const recipeState = await readDefaultRecipes();
  const validationError = validateRecipeState(recipeState);
  if (validationError) {
    throw new Error(validationError);
  }

  const current = JSON.parse(await fs.readFile(dataFile, "utf8"));
  current.recipeState = recipeState;
  current.recipeUpdatedAt = new Date().toISOString();

  const tmpFile = `${dataFile}.tmp`;
  await fs.writeFile(tmpFile, `${JSON.stringify(current, null, 2)}\n`, "utf8");
  await fs.rename(tmpFile, dataFile);

  const summary = countRecipes(recipeState);
  console.log(`Receteler guncellendi: ${summary.categories} kategori, ${summary.products} urun, ${summary.sizes} olcu.`);
  console.log(dataFile);
}

async function readDefaultRecipes() {
  const source = await fs.readFile(recipeDataFile, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, {
    filename: recipeDataFile,
    timeout: 1000
  });

  const data = sandbox.window.DEFAULT_RECIPE_DATA;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("recipe-data.js icinde window.DEFAULT_RECIPE_DATA bulunamadi.");
  }

  return data;
}

function countRecipes(recipeState) {
  const summary = {
    categories: 0,
    products: 0,
    sizes: 0
  };

  for (const products of Object.values(recipeState)) {
    summary.categories += 1;
    summary.products += Object.keys(products || {}).length;
    for (const sizes of Object.values(products || {})) {
      summary.sizes += Object.keys(sizes || {}).length;
    }
  }

  return summary;
}
