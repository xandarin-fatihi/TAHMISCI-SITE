# Tahmisci Coffee & Roastery Klasor Semasi

```text
TAH/
|-- index.html                         # Ana QR menu ekrani
|-- styles.css                         # Ana menu ve ortak arayuz stilleri
|-- menu.js                            # Ana menu davranislari, SSE ve backend okuma
|-- menu-data.js                       # Varsayilan menu verisi
|-- recipe-data.js                     # Varsayilan recete verisi
|-- favicon.png
|-- README.md
|-- GUVENLIK-RAPORU.md
|-- KLASOR-SEMASI.md
|-- DEPLOYMENT-GODADDY-NGINX.md        # GoDaddy, PM2, Nginx ve SSL rehberi
|-- admin/
|   `-- login.html                     # Backend dogrulamali admin girisi
|-- backend/
|   |-- .env.example                   # Canli ortam degiskenleri sablonu
|   |-- .gitignore
|   |-- ecosystem.config.cjs           # PM2 process tanimi
|   |-- package.json
|   |-- README.md
|   |-- browser-client/
|   |   `-- tahmisci-backend-client.mjs
|   |-- public/
|   |   `-- index.html                 # Manager key ile panel sifresi degistirme
|   `-- src/
|       |-- config.js                  # .env ve production guvenlik kontrolleri
|       |-- server.js                  # Express API, routing, CORS, auth guard
|       |-- validators.js              # API veri dogrulama ve URL guvenligi
|       |-- middleware/
|       |   `-- auth.js                # JWT/cookie admin oturumu
|       `-- store/
|           `-- file-store.js          # JSON dosya store ve bcrypt hash
|-- images/
|   |-- PNG_Logo.png
|   |-- logo.png
|   |-- logo_green.png
|   |-- siyah.jpg
|   `-- yesil.jpg
|-- panel/
|   |-- index.html                     # Canli admin panel arayuzu
|   |-- panel.css
|   `-- panel.js
|-- recete/
|   |-- index.html                     # Sifreli recete arayuzu
|   |-- recete.css
|   `-- recete.js
|-- site/                              # Bos ayrilmis klasor
`-- Tahmisçi_Logo/                     # Marka dosyalari, fontlar ve mockup varliklari
```

## Canliya Yukleme Notu

- `panel/`, `recete/`, `admin/`, `backend/`, kok HTML/CSS/JS dosyalari ve gerekli gorseller sunucuya yuklenir.
- Canli URL yapisi: ana menu `https://tahmiscicoffee.com/`, admin paneli `https://tahmiscicoffee.com/panel/`, recete `https://tahmiscicoffee.com/recete/`.
- `backend/.env` repoya eklenmez; `.env.example` kopyalanarak sunucuda doldurulur.
