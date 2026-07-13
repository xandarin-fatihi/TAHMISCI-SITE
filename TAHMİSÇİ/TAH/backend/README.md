# Tahmisci Backend API

Bu backend ana siteyi, admin panelini ve recete arayuzunu `MAIN_DOMAIN` uzerinden servis edecek sekilde duzenlenmistir.

## Guvenli Kurulum

```bash
cd backend
copy .env.example .env
npm install
npm start
```

`.env` icindeki tum `change-this...` degerlerini canliya almadan once degistirin. `JWT_SECRET` ve `PASSWORD_MANAGER_KEY` uzun, rastgele ve repoya eklenmeyen degerler olmalidir.

## Zorunlu Ortam Degiskenleri

```text
NODE_ENV=production
PORT=8080
MAIN_DOMAIN=tahmiscicoffee.com
ADMIN_DOMAIN=admin.tahmiscicoffee.com
PUBLIC_SITE_URL=https://tahmiscicoffee.com
ALLOWED_ORIGINS=https://tahmiscicoffee.com,https://www.tahmiscicoffee.com,https://admin.tahmiscicoffee.com
JWT_SECRET=uzun-rastgele-secret
JWT_EXPIRES_IN=5m
PASSWORD_MANAGER_KEY=uzun-rastgele-manager-key
PASSWORD_RESET_EMAIL=zekimerttunaydin@tahmiscicoffee.com
PASSWORD_RESET_CODE_TTL_MINUTES=10
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=zekimerttunaydin@tahmiscicoffee.com
SMTP_PASS="GOOGLE_UYGULAMA_SIFRESI"
SMTP_FROM="Tahmisci Panel <zekimerttunaydin@tahmiscicoffee.com>"
DEFAULT_PANEL_PASSWORD=IlkGucluSifre123
DEFAULT_RECIPE_PASSWORD=
DATA_FILE=./data/store.json
MEDIA_DIR=./data/media
```

`DEFAULT_PANEL_PASSWORD` sadece `DATA_FILE` henuz olusmamisken ilk panel hash'ini uretmek icin kullanilir.
`DEFAULT_RECIPE_PASSWORD` bos birakilirsa ilk kurulumda recete sifresi panel sifresiyle ayni baslar. Var olan canli veride `recipePasswordHash` yoksa backend ilk calismada mevcut panel hash'ini recete icin de kopyalar; bundan sonra iki sifre birbirinden bagimsiz guncellenir.
`PASSWORD_RESET_EMAIL` panel veya recete sifresini e-posta kodu ile ayri ayri degistirme yetkisine sahip adrestir. Gmail icin `SMTP_PASS` normal hesap sifresi degil, Google hesabindan uretilen 16 haneli uygulama sifresi olmalidir. Gercek `.env` dosyasini GitHub'a eklemeyin. Kullanici ekrani: `https://tahmiscicoffee.com/password-reset/`.
`MEDIA_DIR`, admin panelden yuklenen banner gorsel ve videolarinin saklandigi klasordur. Varsayilan `./data/media` klasoru GitHub'a eklenmez ve sunucuda kalici veri olarak korunmalidir.

## Subdomain Routing

- `https://tahmiscicoffee.com/` public menu sitesini acar.
- `https://tahmiscicoffee.com/panel/` admin panelini acar.
- `https://tahmiscicoffee.com/recete/` sifreli recete arayuzunu acar.
- `https://admin.tahmiscicoffee.com/login.html` admin giris ekranidir.
- `https://admin.tahmiscicoffee.com` kullaniliyorsa ana domaine yonlendirilmelidir.
- `https://admin.tahmiscicoffee.com/admin-password` manager key ile panel sifresi degistirme ekranidir.

## API

- `GET /api/health`: Saglik kontrolu.
- `POST /api/admin/login`: Bcrypt hash ile sifre dogrular, JWT dondurur ve HTTP-only cookie set eder.
- `POST /api/admin/logout`: Admin cookie'sini temizler.
- `GET /api/admin/me`: Gecerli Bearer token veya admin cookie ister.
- `POST /api/admin/password`: `PASSWORD_MANAGER_KEY` ile admin sifresini degistirir.
- `POST /api/recipe/login`: Recete sifresini dogrular, recete JWT'si dondurur ve ayri HTTP-only cookie set eder.
- `GET /api/recipe/me`: Gecerli recete veya admin oturumu ister.
- `POST /api/admin/password-reset/request`: Yetkili e-postaya 6 haneli dogrulama kodu gonderir.
- `POST /api/admin/password-reset/confirm`: Kod dogruysa secilen panel veya recete sifresini gunceller.
- `POST /api/media`: Admin token/cookie ister; banner gorsel ve video dosyalarini backend'e yukler.
- `GET /media/...`: Yuklenen banner gorsel ve videolarini public menuye servis eder.
- `GET /api/menu`, `GET /api/site`, `GET /api/recipes`: Public okuma endpointleri.
- `PUT /api/menu`, `PUT /api/site`, `PUT /api/recipes`: Admin token/cookie ister.
- `GET /api/*/events`: SSE canli guncelleme endpointleri.

## Recete Verisi

`recipe-data.js` varsayilan recete verisidir. Recete olcu degeri eski formatta string olabilir veya yeni formatta `{ "content": "...", "preparation": "..." }` olabilir. Yeni formatta `content` icerik listesini, `preparation` ise recete ekranindaki "Hazirlanisi" butonunda gosterilecek yapilis bilgisini tasir.

Canli sunucuda backend store verisini `recipe-data.js` ile guncellemek icin:

```bash
cd /var/www/tahmisci-app/index.html/backend
npm run import:recipes
pm2 restart tahmisci-backend --update-env
```

## Guvenlik Notlari

- `.env`, `data/` ve `node_modules/` `.gitignore` icindedir.
- Production ortaminda `ALLOWED_ORIGINS=*` kabul edilmez.
- Production ortaminda `JWT_SECRET`, `MAIN_DOMAIN`, `ADMIN_DOMAIN`, `ALLOWED_ORIGINS` ve uzun `PASSWORD_MANAGER_KEY` zorunludur.
- Admin sifre degistirme ve yazma API'leri admin origin kontrolunden gecer. Login ve oturum kontrolu, ana domaindeki sifreli recete arayuzu icin ana domain origininden de calisir.
- Panel ve recete sifreleri ayri bcrypt hash olarak saklanir. E-posta dogrulamali reset ekrani, secilen sifreyi digerini etkilemeden gunceller.
- Admin sayfalari sadece admin host'unda ve `requireAdminPage` middleware'inden sonra statik servis edilir.
- Frontend token'i `sessionStorage`da tutar; sayfa korumasi icin backend tarafinda HTTP-only cookie de kullanilir.

## PM2

Canli sunucuda:

```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup systemd
```

Detayli GoDaddy, Nginx ve SSL rehberi icin kokteki `DEPLOYMENT-GODADDY-NGINX.md` dosyasini kullanin.
