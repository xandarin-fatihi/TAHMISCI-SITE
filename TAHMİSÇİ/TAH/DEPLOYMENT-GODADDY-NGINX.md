# Tahmisçi production deployment

Ubuntu, Node.js 20, PM2, Nginx ve Certbot içindir. Uygulama kökü örneği:

```bash
export APP_ROOT="/var/www/tahmisci-app/TAHMİSÇİ/TAH"
cd "$APP_ROOT/backend"
cp .env.example .env                 # yalnızca ilk kurulum; gerçek değerleri sunucuda doldur
npm install --omit=dev
npm run check
npm test
```

Mevcut sunucuda repo içeriği başka dizindeyse yalnızca `APP_ROOT` değerini gerçek `TAH` dizinine göre değiştirin.

## Veri güvenliği ve güncelleme

`backend/data/store.json`, `backend/data/media/` ve `backend/data/backups/` kalıcıdır; Git checkout/pull, rsync `--delete` veya temiz deployment ile silinmemelidir. Gerçek `.env` de korunur.

```bash
cd "$APP_ROOT/backend"
npm run backup
npm run migrate
npm run check
npm test
pm2 reload tahmisci-backend --update-env
```

İlk PM2 kurulumu:

```bash
cd "$APP_ROOT/backend"
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup systemd
```

## Nginx

```nginx
upstream tahmisci_node {
    server 127.0.0.1:8080;
    keepalive 16;
}

server {
    listen 80;
    listen [::]:80;
    server_name tahmiscicoffee.com www.tahmiscicoffee.com admin.tahmiscicoffee.com;
    client_max_body_size 120m;

    location /api/public/events {
        proxy_pass http://tahmisci_node;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 1h;
    }

    location / {
        proxy_pass http://tahmisci_node;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
    }
}
```

`client_max_body_size 120m` backend video limitiyle uyumludur. `/media/` Node üzerinden Range/206 desteğiyle servis edilir. Nginx'i doğrulayıp yükleyin:

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d tahmiscicoffee.com -d www.tahmiscicoffee.com -d admin.tahmiscicoffee.com
```

## Sağlık ve route kontrolleri

```bash
curl -fsS https://tahmiscicoffee.com/api/health
curl -I https://tahmiscicoffee.com/
curl -I https://tahmiscicoffee.com/qr-menu/
curl -I https://tahmiscicoffee.com/panel/
curl -I https://tahmiscicoffee.com/recete/
curl -I https://tahmiscicoffee.com/password-reset/
curl -fsS https://tahmiscicoffee.com/api/public/bootstrap
pm2 status
sudo nginx -t
```

`/panel/` ve `/recete/` oturumsuz istekte login/401 davranışı göstermelidir; public olmamalıdır. Canlıya almadan önce `.env`, store, backup, medya ve `node_modules` dosyalarının Git diff'te olmadığını doğrulayın.
