# Sistem haritası

```text
Admin Paneli ── PUT menu/recipes/site ──► Express + validator
     │                                         │
     │                                         ├─► atomik file store
     │                                         ├─► site revisions (10)
     │                                         └─► public SSE olayı
     │
     ├─ menü ürünü.recipeId ────────────► recipeCatalog stable ID
     │                                         │
     │                                         └─ yalnızca public content
     ▼
GET /api/public/bootstrap ◄──────── menu + recipe projection + siteState
     │
     ├─► Yeni site `/` (ilk yükleme + tek SSE bağlantısı)
     └─► QR menü `/qr-menu/` (`menuState` + menu SSE)
```

## Güven sınırları

- Public site bütün `recipeState` verisini indirmez; birleşim backend'de yapılır.
- `preparation`, barista notu, kullanıcı, atama, sınav ve aktivite sadece yetkili API'lerde kalır.
- Panel ve reçete yolları JWT/HTTP-only cookie, host/origin ve rol middleware'leriyle korunur.
- Medya `/media/` altında kalıcıdır; store sadece URL taşır. Kullanımdaki medya admin tarafından bile silinemez.
- Site içerikleri HTML olarak basılmaz; siteState validator script, event handler ve güvenli olmayan URL'leri reddeder.

## Güncelleme sırası

1. Admin formu yerelde dirty olur.
2. “Kaydet ve Yayınla” ile backend doğrular.
3. Önceki siteState revizyonlanır, store atomik yazılır.
4. SSE bootstrap olayı gönderilir.
5. Açık site yeni projection'ı uygular; kopan SSE kontrollü backoff ile tek bağlantı olarak döner.

## Başlangıç ve migration

Boş store'da gerçek menü/reçete seed'i bir kez yüklenir. Dolu store'a seed uygulanmaz. Migration geriye uyumlu ve idempotenttir; güvenli birebir reçete eşleşmelerini bağlar, belirsizleri admin inceleme listesine bırakır. Canlı sıra: `npm run backup`, `npm run migrate`, `npm run check`, `npm test`.

