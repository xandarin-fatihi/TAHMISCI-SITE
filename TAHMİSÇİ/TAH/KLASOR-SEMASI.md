# Klasör şeması

```text
TAHMİSÇİ/TAH/
├── site/                       # Yeni public marka sitesi
│   ├── assets/                 # Mevcut görsel, font ve hero/reels medyası
│   ├── css/
│   └── js/                     # Runtime + public data provider
├── qr-menu/                    # Korunan hafif QR menü
├── panel/                      # Admin ve Site Düzenleme CMS
├── recete/                     # Yetkili reçete/barista arayüzü
├── password-reset/
├── admin/
├── backend/
│   ├── src/
│   │   ├── server.js           # API, SSE ve static routing
│   │   ├── public-bootstrap.js # Güvenli public projection
│   │   ├── site-state.js       # SiteState varsayılan/migration
│   │   ├── validators.js
│   │   └── store/              # File store, migration ve seed
│   ├── scripts/                # backup, migrate, asset check
│   ├── test/                   # Node yerleşik testleri
│   └── data/                   # Git dışı canlı store, medya, backup
├── menu-data.js                # Yalnızca boş store ilk seed
├── recipe-data.js              # Yalnızca boş store ilk seed
├── SISTEM-HARITASI.md
└── DEPLOYMENT-GODADDY-NGINX.md
```

Express `/` isteğinde `site/index.html`, `/qr-menu/` isteğinde `qr-menu/index.html` verir. Panel/recete static dosyaları backend auth/host korumasını aşmadan servis edilir. `recipe-data.js` ve `menu-data.js` public değildir. `backend/data/` Git pull/deploy sırasında silinmez veya varsayılanlarla değiştirilmez.
