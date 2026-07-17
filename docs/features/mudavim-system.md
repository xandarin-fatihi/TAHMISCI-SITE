# Tahmisçi Müdavim Sistemi

Bu aşama yalnızca çalışan UI prototipidir. Backend, database, gerçek auth, Google login veya API endpoint içermez.

## Müşteri UI

- Public URL: `/mudavim`
- Karşılama, mock giriş/kayıt, profil, QR kart, ilerleme ve ödül alanları vardır.
- Mock giriş formu sadece arayüz durumunu değiştirir.
- Müşteri ziyaret veya ödül ekleyemez.

## Admin UI

- Admin panel sidebar içinde `Müdavimler` sekmesi tasarlanır.
- Mock müşteri listesi, müşteri detayı, ziyaret geçmişi, ödül kuralları, kampanyalar ve ayarlar bulunur.
- Liste, seviye ve ödül filtresi UI tarafında çalışır.

## Ana Kampanya

10 içecek tamamlanınca 11. alışverişte yanında tatlı hakkı.

## Sonraki Faz

1. Canonical müşteri, ziyaret, ödül ve kampanya şeması.
2. Admin CRUD endpointleri.
3. QR doğrulama ve personel işlem akışı.
4. KVKK/onay metinleri ve rate-limit güvenliği.
5. Public SSE ile profil/ödül güncelleme.
