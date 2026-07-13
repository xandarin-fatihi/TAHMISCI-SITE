# Lokal geliştirme

Lokal sistem production store, medya ve `.env` dosyasından ayrıdır. Ek ortam değişkeni hazırlamadan repo kökünde çalışır.

## Kurulum ve başlatma

Node.js 18 veya üzeri gerekir.

```bash
npm install
npm run dev:local
```

İlk açılışta gerçek 215 ürünlük menü, mevcut reçeteler ve mevcut hero/reels/hakkımızda/iletişim başlangıç içeriği yüklenir. Lokal store daha önce varsa yeniden seed edilmez ve yaptığınız değişiklikler korunur.

## Lokal giriş bilgileri

- Admin şifresi: `Tahmisci-Local-Admin-2026!`
- Reçete şifresi: `Tahmisci-Local-Recete-2026!`

Bu bilgiler yalnızca `development` modundaki lokal script tarafından uygulanır. Production config; lokal bayrağı, lokal veri yollarını ve bilinen lokal bilgileri kod seviyesinde reddeder. `.env.local.example` bilgilendirme amaçlıdır, kopyalanması gerekmez.

## Adresler

- Site: `http://localhost:8080/`
- Canlı menü: `http://localhost:8080/#menu`
- Admin giriş: `http://localhost:8080/login.html`
- Admin paneli: `http://localhost:8080/panel/`
- Reçete: `http://localhost:8080/recete/`
- QR menü: `http://localhost:8080/qr-menu/`
- Health: `http://localhost:8080/api/health`

## Lokal veri konumu

- Store: `TAHMİSÇİ/TAH/backend/data/local-dev-store.json`
- Medya: `TAHMİSÇİ/TAH/backend/data/local-dev-media/`

Bu yollar `.gitignore` kapsamındadır. `store.json` ve `data/media/` production verisine dokunulmaz. Başlatma scripti mevcut `.env` dosyasını yazmaz veya değiştirmez.

## Lokal reset

Önce çalışan lokal sunucuyu `Ctrl+C` ile kapatın, ardından:

```bash
npm run local:reset
```

Reset scripti yalnızca yukarıdaki iki lokal hedefi siler; tam yol eşleşmesi ve lokal data dizini doğrulanmadan işlem yapmaz.

## Smoke test

```bash
npm run test:local
```

Test ayrı `local-smoke-*` verisiyle backend'i başlatır; health, site, admin login/panel, reçete, QR menü, public bootstrap, 215 ürün, veri sızıntısı, static dosyalar, MP4 Range/206, site yayını ve reçete→ürün içerik akışını doğrular. Test verisini sonunda siler.

## Port 8080 doluysa

Tüm platformlarda:

```bash
npm run dev:local -- --port=8081
```

Windows PowerShell alternatifi:

```powershell
$env:PORT=8081
npm run dev:local
Remove-Item Env:PORT
```

macOS/Linux alternatifi olarak aynı `-- --port=8081` biçimini kullanın; shell'e özel `NODE_ENV=...` komutu gerekmez.

## Sık karşılaşılan hatalar

- `EADDRINUSE`: Port kullanımdadır; farklı port verin veya önceki Node sürecini kapatın.
- `npm` bulunamadı: Node.js 18+ LTS kurulumunu ve yeni terminal açıldığını doğrulayın.
- Giriş kabul edilmiyor: Production `npm start` yerine `npm run dev:local` kullandığınızı kontrol edin. Gerekirse sunucuyu kapatıp `npm run local:reset` çalıştırın.
- Medya görünmüyor: `local-dev-media/` yazma iznini ve tarayıcı Network sekmesini kontrol edin.
- Eski içerik görünüyor: Hard refresh yapın; lokal store'u yalnızca bilinçli olarak resetleyin.

## Sunucuyu kapatma

Sunucunun çalıştığı terminalde `Ctrl+C` kullanın. Lokal veriniz korunur; sonraki `npm run dev:local` çalıştırmasında aynı store açılır.
