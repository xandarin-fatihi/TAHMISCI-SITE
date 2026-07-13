# Tahmisçi birleşik uygulaması

Bu dizin production uygulamasının köküdür. Express; yeni siteyi `/`, eski QR menüyü `/qr-menu/`, paneli `/panel/`, reçete ekranını `/recete/` altında servis eder.

## Bileşenler

- `site/`: mevcut tasarımı ve hero/reels yerleşimini koruyan yeni site. Menü ve site içeriğini yalnızca public bootstrap API'den alır.
- `qr-menu/`: aynı `menuState` verisini kullanan eski hafif QR menü.
- `panel/`: menü, reçete bağlantısı, kullanıcı/eğitim sistemleri ve kontrollü “SİTE DÜZENLEME” CMS'i.
- `recete/`: yetkili barista/reçete arayüzü.
- `backend/`: doğrulama, dosya store, migration, medya, public projection, SSE ve static routing.
- `menu-data.js`, `recipe-data.js`: yalnızca boş store için idempotent ilk seed kaynakları; public static dosya değildir.

## Tek veri kaynağı

- `menuState`: kategori, ürün, fiyat/varyant, görsel, stok, aktiflik, popülerlik, sıralama ve reçete bağlantısı.
- `recipeState` + `recipeCatalog`: reçete içeriği/hazırlanışı ve değişmeyen reçete kimliği.
- `siteState`: hero/reels, bölüm metinleri, hakkımızda, QR, ortak iletişim/sosyal, footer, SEO, dil, görünürlük ve sıra.
- `backend/data/media`: yüklenen kalıcı medya; JSON'a base64 yazılmaz.

## Yayın akışı

Paneldeki değişiklikler yerelde dirty durumda tutulur. “Kaydet ve Yayınla” backend doğrulamasından geçer, site için son 10 revizyondan birini oluşturur, store'u geçici dosya + rename ile atomik yazar ve SSE olayı yayınlar. Site açıkken bootstrap verisini yeniden alarak kendini günceller.

## Komutlar

```bash
npm install
npm run dev:local
```

Komut repo kökünde çalıştırılır ve production'dan ayrı `backend/data/local-dev-*` yollarını kullanır. Lokal ayrıntılar için repo kökündeki `LOCAL-DEVELOPMENT.md`; production migration için [`backend/README.md`](backend/README.md), [`SISTEM-HARITASI.md`](SISTEM-HARITASI.md) ve [`DEPLOYMENT-GODADDY-NGINX.md`](DEPLOYMENT-GODADDY-NGINX.md) kullanılır.
