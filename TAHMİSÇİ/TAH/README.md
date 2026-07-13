# Tahmisci Coffee & Roastery Kaynak Kod Paketi

Bu klasor temizlenmis Tahmisci QR menu, admin paneli, recete arayuzu ve ortak backend kaynak kodlarini icerir.

## Hizli baslangic

- Ana menu: `index.html`
- Alternatif ilk ekran: `index-alternatif.html`
- Admin paneli: `panel/`
- Recete ekrani: `recete/`
- Ogretici rehber: `admin-ogretici-index.html`
- Klasor semasi: `KLASOR-SEMASI.md`
- Canli kurulum: `DEPLOYMENT-GODADDY-NGINX.md`

## Notlar

- Eski proje adlari temizlenip Tahmisci adina gore duzenlendi.
- Ana stil ve menu davranis dosyalari okunur adlarla duzenlendi.
- Recete ekrani temiz adla `recete/` klasoru icine tasindi.
- QR gorselleri, eski yedekler ve kullanilmayan kopya klasorler aktarilmadi.
- Canli kopyada ana menu `https://tahmiscicoffee.com/`, admin paneli `https://tahmiscicoffee.com/panel/`, recete `https://tahmiscicoffee.com/recete/` adresinden acilir. Canli kurulum icin `backend/.env.example` dosyasini `.env` olarak kopyalayip domain ve secret degerlerini doldurun.
- Panel ve recete sifreleri backend tarafinda ayri hash olarak tutulur. `https://tahmiscicoffee.com/password-reset/` ekraninda ayni yetkili e-posta ile panel veya recete sifresi ayri ayri degistirilebilir.
- Recete verisi Excel kaynakli guncel formatta `recipe-data.js` icindedir. Hazirlanis bilgisi olan urunlerde recete ekraninda `Hazirlanisi` butonu gorunur. Canli backend store'unu bu veriye tasimak icin sunucuda `cd /var/www/tahmisci-app/index.html/backend && npm run import:recipes` calistirilir.
