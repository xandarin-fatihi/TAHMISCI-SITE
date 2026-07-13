# Tahmisci Guvenlik ve Routing Raporu

## Kapatilan Riskler

- Frontend icindeki sabit admin sifresi kaldirildi. `panel/panel.js` artik her giriste backend `POST /api/admin/login` dogrulamasi ister.
- Recete ekranindaki sabit fallback sifreler kaldirildi. `recete/recete.js` artik backend recete oturumu olmadan acilmaz.
- Backend artik `JWT_SECRET` yoksa production'da baslamaz. Development icin gecici secret sadece uyariyla uretilir.
- Ilk panel sifresi artik kod icinden uretilmez. `DEFAULT_PANEL_PASSWORD` `.env` icinden gelmek zorundadir.
- Panel ve recete sifreleri ayri bcrypt hash olarak saklanir. Var olan canli veride recete hash'i yoksa ilk geciste mevcut panel hash'i recete icin kopyalanir, sonra e-posta dogrulamali reset ekraniyla ayri ayri degistirilir.
- Sifre kurali en az 10 karakter, en az bir harf ve bir rakam olacak sekilde guclendirildi.
- Admin login basarili olunca JWT hem response ile doner hem HTTP-only cookie olarak set edilir.
- Admin API endpointleri Bearer token veya guvenli cookie ile korunur.
- Admin sifre degistirme ve yazma endpointleri admin origin kontroluyle CSRF riskine karsi daraltildi. Login ve oturum kontrolu, ana domaindeki sifreli recete arayuzu icin ana domain originine de izin verir.
- API validator katmani tehlikeli script metinlerini, guvensiz medya URL'lerini ve asiri buyuk JSON govdelerini reddeder.
- Admin paneli hedef geregi `https://tahmiscicoffee.com/panel/` adresinden acilir ve backend API oturumu ister.
- Ana domain `tahmiscicoffee.com` altinda `backend/` gibi ic dosyalar public servis edilmez. Recete arayuzu `https://tahmiscicoffee.com/recete/` adresinden sifreli olarak acilir.
- CORS production'da `ALLOWED_ORIGINS=*` kabul etmeyecek sekilde sertlestirildi.

## Eklenen / Degisen Kritik Dosyalar

- `backend/src/config.js`
- `backend/src/middleware/auth.js`
- `backend/src/server.js`
- `backend/src/store/file-store.js`
- `backend/src/validators.js`
- `backend/ecosystem.config.cjs`
- `backend/.env.example`
- `backend/.gitignore`
- `admin/login.html`
- `panel/panel.js`
- `recete/recete.js`
- `menu.js`
- `site.js`
- `backend/browser-client/tahmisci-backend-client.mjs`
- `DEPLOYMENT-GODADDY-NGINX.md`

## Canli Kurulum Ozeti

1. `backend/.env.example` dosyasini `backend/.env` olarak kopyalayin.
2. `MAIN_DOMAIN`, `ADMIN_DOMAIN`, `PUBLIC_SITE_URL` ve `ALLOWED_ORIGINS` degerlerini kendi domainlerinize gore doldurun.
3. `JWT_SECRET` ve `PASSWORD_MANAGER_KEY` icin uzun rastgele degerler uretin.
4. `DEFAULT_PANEL_PASSWORD` icin ilk kurulumda kullanilacak guclu panel sifresini yazin. Recete sifresinin ilk kurulumda farkli baslamasini istiyorsaniz `DEFAULT_RECIPE_PASSWORD` de ekleyin; bos kalirsa panel sifresiyle ayni baslar.
5. `cd backend && npm install && npm start` komutlariyla baslatin.

## Test Edilenler

- 13 JavaScript/MJS/CJS kaynak dosyasi `node --check` ile sentaks kontrolunden gecirildi.
- `validators.js` icin guvenli URL kabul, `javascript:` medya URL reddi smoke testi calistirildi.
- Runtime HTTP testi icin bu kopyada `node_modules` olmadigindan Express server baslatilmadi; canli kurulumda `npm install --omit=dev` sonrasi `pm2 start ecosystem.config.cjs --env production` kullanilmalidir.
