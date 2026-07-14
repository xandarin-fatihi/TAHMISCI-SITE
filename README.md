# Tahmisci Site

Tahmisci; public web sitesi, admin paneli, recete/barista arayuzu, QR menu ve Express API uygulamalarini tek repoda toplar.

## Hizli Baslangic

```bash
npm install
npm run dev:local
```

## Komutlar

- `npm run dev:local` - lokal API ve statik uygulamalari baslatir.
- `npm run local:reset` - yalnizca lokal store ve medyayi sifirlar.
- `npm run check` - syntax ve statik asset kontrolleri.
- `npm test` - API ve DOM testleri.
- `npm run test:local` - lokal smoke test.

## URL'ler

- `/` - web sitesi
- `/#menu` - menu bolumu
- `/panel/` - admin paneli
- `/recete/` - recete/barista ekrani
- `/qr-menu/` - QR menu
- `/login.html` - admin girisi
- `/password-reset/` - sifre sifirlama

## Dokumantasyon

- [Dokumantasyon indeksi](docs/index.md)
- [Klasor yapisi](docs/architecture/directory-structure.md)
- [Lokal kurulum](docs/development/local-setup.md)
- [API ozeti](docs/api/overview.md)
