# Tahmisçi Backend API

Node.js 18+ ve Express tabanlı tek veri kaynağıdır. Dosya store yazımları atomiktir; migration bilinmeyen güvenli alanları ve tüm tanınan uygulama verisini korur.

## Kurulum ve doğrulama

```bash
cp .env.example .env
npm install
npm run check
npm test
npm start
```

Production'da `NODE_ENV`, domain/origin, güçlü `JWT_SECRET`, `PASSWORD_MANAGER_KEY`, cookie, SMTP, `DATA_FILE` ve `MEDIA_DIR` değerleri `.env` içinde tanımlanır. Gerçek `.env` repoya eklenmez.

Lokal önizleme için repo kökünde `.env` oluşturmadan `npm install` ve `npm run dev:local` kullanılır. Bu akış production store/medyadan ayrı `local-dev-*` hedeflerini zorlar; `npm run local:reset` yalnızca bu hedefleri silebilir ve `npm run test:local` ayrı smoke store ile uçtan uca kontrol yapar. Ayrıntılar repo kökündeki `LOCAL-DEVELOPMENT.md` dosyasındadır.

## Store şeması

Store şema sürümü `2`'dir. Başlıca alanlar:

- `schemaVersion`, `createdAt`, `updatedAt`
- admin ve reçete parola hash'leri/ayarları
- `menuState`, `recipeState`, `recipeCatalog`, `recipeLinkReview`
- `siteState`, `siteRevisions` (son 10 yayın)
- `recipeUsers`, `recipeAssignments`, `recipeActivity`, `feedbackItems`
- uygulamanın ileride eklediği bilinmeyen güvenli alanlar

`normalizeStore` ve `normalizeRecipeState`; kullanıcıları, atamaları, aktiviteleri, not/aktiflik/sıra alanlarını veya bilinmeyen uygulama alanlarını silmez. Migration idempotenttir ve dolu store'u seed ile ezmez.

## SiteState şeması

`siteState.schemaVersion = 2` ve ana bölümleri `global`, `header`, `hero`, `featuredProducts`, `menuSection`, `about`, `qrMenu`, `contact`, `footer`, `seo`, `sectionOrder`, `updatedAt` alanlarıdır. Yerelleştirilen metinler `{ "tr": "...", "en": "..." }` biçimindedir; İngilizce boşsa Türkçe fallback uygulanır. Eski düz alanlar migration ile taşınır, bilinmeyen değerler korunur. Validator gömülü medya, script/event handler, `javascript:` URL, geçersiz protokol, boyut, tür ve hero aralıklarını reddeder.

## Menü–reçete bağlantısı

Her reçete `recipeCatalog` içinde değişmeyen bir kimlik taşır. Menü ürünü `recipeId`, `recipeSize`, `contentMode` ve gerekirse `manualContent` tutar. `contentMode` değerleri:

- `recipe`: bağlı reçeteden yalnızca public `content`; ölçü tercihi `recipeSize`, sonra `Standart`, `16 oz`, ilk geçerli ölçü.
- `manual`: paneldeki manuel içerik.
- `hidden`: içerik public çıktıda gösterilmez.

İlk migration sadece kategori+ürün adı birebir ve benzersizse bağlar. Aynı isimli/belirsiz kayıtlar `recipeLinkReview` listesine girer. Reçete adı değişse de kimlik korunduğu için bağlantı kopmaz. Silme öncesi panel bağlı ürünleri uyarır; silinen bağlantı ürünün manuel/boş fallback'ine çevrilir.

## Public API

- `GET /api/health`: sağlık.
- `GET /api/public/bootstrap`: yayınlanmış `siteState`, aktif menü projection'ı, fiyat/varyant, medya, kalori, alerjen ve çözümlenmiş public içerik.
- `GET /api/public/events`: bootstrap SSE; menü, reçete veya site yayını sonrası günceller.
- `GET /api/menu`, `GET /api/menu/events`: eski QR menünün public menü akışı.
- `GET /api/site`, `GET /api/site/events`: public site içerik akışı.
- `POST /api/feedback`: public geri bildirim oluşturma.

Public bootstrap; hazırlanış, gizli ölçülü tarif, barista notu, admin/parola/token, kullanıcı, ödev, sınav ve aktivite göndermez. Cache başlığı kısa süreli revalidation kullanır.

## Yetkili API

- Admin: `/api/admin/login`, `/logout`, `/me`, `/session/refresh`, parola/reset, reçete kullanıcı ve atama endpointleri.
- Yazma: `PUT /api/menu`, `PUT /api/recipes`, `PUT /api/site` yalnızca admin oturumu ve izinli origin ile.
- Reçete: `GET /api/recipes`, `/api/recipes/events`, `/api/recipe/*` yalnızca reçete veya admin oturumu ile.
- Medya: `POST/GET /api/media`, `DELETE /api/media/:name` yalnızca admin. Kullanılan medya silinemez.
- Revizyon: `GET /api/admin/site/revisions`, `POST /api/admin/site/revisions/:id/restore` yalnızca admin.

Upload adı backend tarafından güvenli ve benzersiz üretilir; uzantı, MIME ve dosya imzası birlikte doğrulanır. Görsel limiti 15 MB, video limiti 120 MB'dir; JPEG/PNG/WebP/GIF ve MP4/WebM kabul edilir.

## Backup ve migration

```bash
npm run backup
npm run migrate
```

Backup varsayılan olarak `data/backups/store-<timestamp>.json` üretir. Bu klasör public/static değildir ve Git tarafından yok sayılır. Migration geçici dosya + rename ile yazar. Canlıda her zaman önce backup alın.

## Testler

`npm run check` syntax ve HTML/CSS/JS/görsel/video referanslarını; `npm test` store korumasını, seed'i, stable reçete bağlantısını, public veri sızıntısını, içerik modlarını, auth, medya, SSE ve ana route'ları test eder.
