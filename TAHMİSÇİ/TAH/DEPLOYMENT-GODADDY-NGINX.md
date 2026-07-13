# Tahmisci Production Deployment Guide

Bu rehber GoDaddy DNS + Ubuntu VPS + Nginx reverse proxy + PM2 + Certbot kurulumu icindir.

## 1. DNS

GoDaddy DNS ekraninda VPS public IP adresinizi `SUNUCU_IP_ADRESI` yerine kullanin.

```text
Type   Name    Value             TTL
A      @       SUNUCU_IP_ADRESI  600 veya 1 Hour
A      admin   SUNUCU_IP_ADRESI  600 veya 1 Hour
CNAME  www     @                 600 veya 1 Hour
```

Notlar:
- `@` ana domaini, ornegin `tahmiscicoffee.com`, VPS'e yollar.
- `admin` kaydi `admin.tahmiscicoffee.com` subdomainini ayni VPS'e yollar.
- `www` icin CNAME yeterlidir; isterseniz `www` icin de A kaydi kullanabilirsiniz.

## 2. Sunucu Hazirligi

```bash
sudo apt update
sudo apt install -y curl git nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

Projeyi ornek olarak `/var/www/tahmisci` altina koyun:

```bash
sudo mkdir -p /var/www/tahmisci
sudo chown -R $USER:$USER /var/www/tahmisci
cd /var/www/tahmisci
```

Dosyalari bu klasore kopyaladiktan sonra backend kurulumu:

```bash
cd /var/www/tahmisci/backend
cp .env.example .env
npm install --omit=dev
```

`.env` icinde canli degerler:

```env
NODE_ENV=production
PORT=8080
MAIN_DOMAIN=tahmiscicoffee.com
ADMIN_DOMAIN=admin.tahmiscicoffee.com
PUBLIC_SITE_URL=https://tahmiscicoffee.com
ALLOWED_ORIGINS=https://tahmiscicoffee.com,https://www.tahmiscicoffee.com,https://admin.tahmiscicoffee.com
JWT_SECRET=48-byte-hex-random-secret
PASSWORD_MANAGER_KEY=32-byte-hex-random-manager-key
DEFAULT_PANEL_PASSWORD=IlkGucluPanelSifresi123
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
DATA_FILE=./data/store.json
MEDIA_DIR=./data/media
```

Secret uretmek icin:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Banner gorsel ve videolari `MEDIA_DIR` klasorune kaydedilir. Bu klasor `backend/data/media` olarak birakilirsa GitHub pull islemleri dosyalari silmez; `backend/.gitignore` icindeki `data/` kurali sayesinde repoya da eklenmez.

## 3. PM2

```bash
cd /var/www/tahmisci/backend
pm2 start ecosystem.config.cjs --env production
pm2 status
pm2 logs tahmisci-backend
pm2 save
pm2 startup systemd
```

`pm2 startup` komutunun ekrana verdigi `sudo env ... pm2 startup ...` komutunu bir kez calistirin. Sonra:

```bash
pm2 save
sudo systemctl status pm2-$USER
```

Yonetim komutlari:

```bash
pm2 restart tahmisci-backend
pm2 reload tahmisci-backend
pm2 stop tahmisci-backend
pm2 logs tahmisci-backend --lines 100
```

## 4. Nginx Reverse Proxy

`/etc/nginx/sites-available/tahmisci` dosyasi:

```nginx
upstream tahmisci_node {
    server 127.0.0.1:8080;
    keepalive 16;
}

server {
    listen 80;
    listen [::]:80;
    server_name tahmiscicoffee.com www.tahmiscicoffee.com admin.tahmiscicoffee.com;

    location / {
        proxy_pass http://tahmisci_node;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        client_max_body_size 120m;
    }
}
```

`client_max_body_size` banner video/gorsel yuklemeleri icin Node tarafindaki 120 MB limit ile uyumlu olmalidir. Daha buyuk videolar icin hem Nginx hem backend upload limitini birlikte artirin.

Aktiflestirme:

```bash
sudo ln -s /etc/nginx/sites-available/tahmisci /etc/nginx/sites-enabled/tahmisci
sudo nginx -t
sudo systemctl reload nginx
```

Uygulama Host header'a gore davranir:
- `tahmiscicoffee.com` ve `www.tahmiscicoffee.com` public QR menuyu acar.
- `tahmiscicoffee.com/panel/` admin panelini acar.
- `tahmiscicoffee.com/recete/` sifreli recete arayuzunu acar.
- `admin.tahmiscicoffee.com` kullaniliyorsa ana domaine yonlendirilmelidir.
- Admin statik dosyalari Nginx tarafindan dogrudan acilmaz; Node.js auth middleware uzerinden gecer.

## 5. SSL - Let's Encrypt Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tahmiscicoffee.com -d www.tahmiscicoffee.com -d admin.tahmiscicoffee.com
sudo certbot renew --dry-run
```

Certbot basarili olunca Nginx dosyasina 443 SSL bloklarini otomatik ekler veya mevcut blogu gunceller. Son kontrol:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Localhost'tan Canli Domaine Gecis

Lokal testte:

```env
NODE_ENV=development
PORT=8080
ALLOW_LOCALHOST_ORIGINS=true
COOKIE_SECURE=false
```

Canliya gecince:
- `COOKIE_SECURE=true` yapin.
- `MAIN_DOMAIN`, `ADMIN_DOMAIN`, `PUBLIC_SITE_URL` ve `ALLOWED_ORIGINS` degerlerini canli domainlerle doldurun.
- Frontend'i Node backend uzerinden servis ediyorsaniz `TAHMISCI_BACKEND_URL` tanimlamaniz gerekmez; `/api/...` ayni origin uzerinden calisir.
- Statik bir hosttan baglanacaksaniz sayfaya `window.TAHMISCI_BACKEND_URL = "https://admin.tahmiscicoffee.com";` ekleyin veya testte `?backend=https://admin.tahmiscicoffee.com` kullanin.
- Admin panel icin canli adres `https://tahmiscicoffee.com/panel/` olmalidir.

## 7. Canli Kontrol Listesi

```bash
curl -I https://tahmiscicoffee.com/
curl -I https://tahmiscicoffee.com/panel/
curl -I https://tahmiscicoffee.com/recete/
curl -I https://admin.tahmiscicoffee.com/login.html
curl https://admin.tahmiscicoffee.com/api/health
pm2 status
sudo nginx -t
sudo certbot renew --dry-run
```

Ilk kurulumdan sonra panel sifresini degistirmek icin:

```text
https://admin.tahmiscicoffee.com/admin-password
```

Bu ekranda `.env` icindeki `PASSWORD_MANAGER_KEY` kullanilir.
