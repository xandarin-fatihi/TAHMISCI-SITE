# Tahmisçi Coffee & Roastery

Bu repo; yeni marka sitesini, hafif QR menüyü, admin panelini, reçete/barista arayüzünü ve Express backend'i tek uygulamada birleştirir. Çalışan uygulama kökü [`TAHMİSÇİ/TAH/`](TAHMİSÇİ/TAH/) dizinidir.

## Adresler

- `/` — canlı veriye bağlı yeni Tahmisçi sitesi
- `/#menu` — sitenin menü bölümü
- `/qr-menu/` — eski hafif QR menü
- `/panel/` — yetkilendirilmiş admin paneli
- `/recete/` — yetkilendirilmiş reçete/barista arayüzü
- `/password-reset/` — şifre yenileme
- `/api/public/bootstrap` ve `/api/public/events` — güvenli public veri ve canlı güncelleme

## Yerel çalıştırma

```bash
npm install
npm run dev:local
```

Tarayıcıdan `http://localhost:8080/` açılır. Lokal store ve medya production verisinden ayrıdır; dolu lokal store yeniden seed edilmez. Giriş bilgileri, reset, farklı port ve smoke test için [`LOCAL-DEVELOPMENT.md`](LOCAL-DEVELOPMENT.md) belgesini kullanın.

## Veri akışı

Admin paneli `menuState`, `recipeState` ve `siteState` verisini backend'e atomik olarak yayınlar. Backend menü ürününü kalıcı `recipeId` ile reçeteye bağlar, yalnızca yayınlanabilir içerik alanını public projection'a ekler ve SSE ile açık site/QR istemcilerini yeniler. Hazırlanış, barista notu, kullanıcı, ödev, sınav ve aktivite verisi public API'ye çıkmaz.

Sistem haritası ve işletim ayrıntıları: [`SISTEM-HARITASI.md`](TAHMİSÇİ/TAH/SISTEM-HARITASI.md), [`backend/README.md`](TAHMİSÇİ/TAH/backend/README.md), [`DEPLOYMENT-GODADDY-NGINX.md`](TAHMİSÇİ/TAH/DEPLOYMENT-GODADDY-NGINX.md).
