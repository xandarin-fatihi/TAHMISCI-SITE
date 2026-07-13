# Aşama 16 - Reçete Adapter Planı

## Amaç

Reçete entegrasyonunu hızlandırmak için ilk gerçek kod adımı adapter/normalizer katmanı olmalı. Bu katman aktif veri dosyasını değiştirmeden düz metin ve `content/preparation` biçimlerini tek modele çevirir.

## Neden Önce Adapter?

- Veri dosyasında iki biçim var: string ve object.
- Panel, reçete ekranı ve backend benzer normalize fonksiyonlarını ayrı ayrı içeriyor.
- Ortak adapter yapılırsa ileride refactor daha hızlı ve güvenli olur.
- Aktif ekran hemen bu dosyaya bağlanmak zorunda değil; önce local test yapılabilir.

## Önerilen Dosya

```text
TAH/app/features/recipe/recipe-adapter.js
```

Eğer `app/` yoksa Aşama 16'da oluşturulacak.

## Adapter Fonksiyonları

| Fonksiyon | Görev |
|---|---|
| `normalizeRecipeItem(value)` | string/object değeri `{ content, preparation }` yapısına çevirir |
| `normalizeRecipeState(raw)` | tüm kategori/ürün/ölçü ağacını normalize eder |
| `recipeContent(value)` | güvenli content döndürür |
| `recipePreparation(value)` | güvenli preparation döndürür |
| `hasRecipeContent(state)` | boş/verisiz state kontrolü yapar |
| `flattenRecipeState(state)` | test ve arama için düz liste üretir |

## Aşama 16 Kapsamı

| İş | Durum |
|---|---|
| Adapter dosyası oluştur | Evet |
| Test fixture dosyası oluştur | Evet |
| Aktif `recipe-data.js` değiştirme | Hayır |
| Aktif reçete ekranına bağlama | Hayır |
| Panel/backend import değişikliği | Hayır |
| Local test notu yazma | Evet |

## Aşama 16 Testi

- `recipe-data.js` içinden 7 kategori okunmalı.
- 77 ürün korunmalı.
- 213 ölçü korunmalı.
- 22 düz metin reçete object biçimine çevrilebilmeli.
- 191 object reçete bozulmadan korunmalı.
- Boş veya hatalı değerler güvenli `{ content: "", preparation: "" }` dönmeli.

## Aşama 16 Prompt

```text
VOLTRAN AŞAMA 16’ya geç.

Amaç:
Reçete entegrasyonunu hızlandırmak için aktif ekrana bağlanmayan ortak recipe adapter katmanını oluştur.

Kurallar:
* Aktif recipe-data.js dosyasını değiştirme.
* Aktif recete, panel, backend, menu.js, styles.css dosyalarını değiştirme.
* Adapter dosyasını canlı ekrana bağlama.
* Sadece yeni app/features/recipe yapısı ve test dokümanı oluştur.
* Veri sayımı ve dönüşüm testi yap.

Yapılacaklar:
1. TAH/app/features/recipe/ klasörü oluştur.
2. recipe-adapter.js dosyasını oluştur.
3. normalizeRecipeItem, normalizeRecipeState, recipeContent, recipePreparation, hasRecipeContent, flattenRecipeState fonksiyonlarını ekle.
4. CommonJS veya browser global kararı ver; mevcut vanilla JS yapısına uygun düşük riskli kullanım seç.
5. Aktif dosyalara import/link ekleme.
6. Node ile recipe-data.js üzerinde sayım/dönüşüm testi yap.
7. docs içine docs/38-asama-16-recete-adapter-raporu.md oluştur.

Son rapor:
* Yapılan Değişiklikler
* Oluşturulan Adapter Dosyası
* Test Sonuçları
* Dokunulmayan Aktif Alanlar
* Aşama 17 Önerisi
```
