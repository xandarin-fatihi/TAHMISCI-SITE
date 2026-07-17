# Tahmisçi Müdavim Sistemi

Bu aşama yalnızca çalışan UI prototipidir. Backend, database, gerçek auth, Google login veya API endpoint içermez.

## Amaç

Tahmisçi müşterisinin dijital müdavim kartıyla tekrar ziyaret motivasyonunu artırmak. Ana kampanya: 10 içecek tamamlanınca 11. alışverişte yanında tatlı hakkı.

## Müşteri Akışı

- Public URL: `/mudavim`
- Müşteri `Müdavim Kartımı Aç`, `Kayıt Ol` veya `Giriş Yap` akışıyla mock UI durumunu görür.
- Profil kartında ad, iletişim, seviye, ziyaret ilerlemesi ve müşteri kodu gösterilir.
- QR kart alanı kasada okutulacak dijital kart hissi verir.
- Ödül alanında aktif, yaklaşan ve kullanılan ödüller ayrılır.
- Müşteri kendi kendine ziyaret veya ödül ekleyemez.

## Admin Akışı

- Admin panel sidebar içinde `Müdavimler` sekmesi bulunur.
- Genel bakış kartları, arama, seviye/ödül filtresi, müşteri listesi ve detay paneli vardır.
- Müşteri seçildiğinde QR placeholder, ziyaret geçmişi, aktif ödüller ve admin notu güncellenir.
- `Ziyaret ekle` ve `Ödülü kullandır` butonları sadece local mock state değiştirir; gerçek kayıt oluşturmaz.
- Ödül kuralları, kampanyalar ve ayarlar alanları UI taslak olarak sunuma hazırdır.

## Mock Data

Prototipte beş örnek müşteri vardır:

- Elif Yılmaz: Gold, 6/10, aktif
- Mehmet Kaya: Silver, 10/10, ödül hazır
- Ayşe Demir: Yeni, 1/10, yeni kayıt
- Burak Çelik: Gold, ödül kullanıldı
- Zeynep Arslan: Silver, 8/10, 2 ziyaret kaldı

## Backend Fazına Geçiş

- Müşteri, ziyaret, ödül, kampanya ve ayar şemaları tanımlanmalı.
- Admin CRUD ve kasada QR doğrulama endpointleri eklenmeli.
- Gerçek auth, KVKK/onay metinleri, rate limit ve audit log tasarlanmalı.
- Mock state yerine canonical store/API kullanılmalı.
- QR kodları tek kullanımlık veya imzalı doğrulama modeliyle güvenceye alınmalı.

## Sonraki Faz Önerileri

1. Store şeması ve migration.
2. Admin müşteri/ödül CRUD.
3. Kasada QR okutma ve personel işlem ekranı.
4. Public müşteri doğrulama ve profil API.
5. Bildirim, doğum günü kampanyası ve segment bazlı ödüller.
