# Product Excel Import System

## Amaç

Admin paneldeki Ürün Düzenleme alanına ürün ek bilgilerini Excel'den toplu aktarmak için kullanılır. Bu sistem ürün fiyatı, kategori yapısı, görsel, durum veya kart tasarımını değiştirmez; yalnızca mevcut ürünlerin ek bilgi alanlarını günceller.

## Excel Yapısı

Her Excel sayfası bir menü kategorisi olarak okunur. Sayfa adı paneldeki kategori adıyla eşleştirilir. Excel sayfa adı kısalmışsa sistem tekil prefix eşleşmesini de dener.

| Excel kolonu | Panel alanı |
| --- | --- |
| Ürün Adı | Mevcut ürün adı |
| Ürün Kalorisi | `product.details.calories` |
| Ürün Alerjeni | `product.details.allergens` |
| Ürün İçeriği | `product.details.ingredients` |

## Aktarım Davranışı

- Kategori sayfa adına göre bulunur.
- Ürün `Ürün Adı` kolonuna göre bulunur.
- Ürün bulunursa yalnız dolu hücrelerdeki ek bilgi alanları güncellenir.
- Ürün veya kategori bulunamazsa satır hata listesine alınır.
- Yeni ürün oluşturulmaz.
- Boş hücre mevcut veriyi silmez.
- Hücrede `BOŞALT` yazıyorsa ilgili alan temizlenir.

## Yedek ve Rapor

Aktarımdan önce store dosyası `backups/product-imports` altına kopyalanır. Rapor toplam satır, güncellenen kayıt, aynı kalan kayıt, hata sayısı, değişen alan ve eski/yeni değer özetlerini gösterir.

Hata varsa paneldeki `Hatalıları Göster` butonu hata listesini odağa alır ve sayfa/satır bazlı kısa hata özetini gösterir.

## İlgili Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html/backend/src/server.js` | `/api/admin/products/import-excel` endpointi, Excel okuma, eşleştirme, yedek ve rapor |
| `index.html/panel/index.html` | Ürün Düzenleme içindeki dosya seçme ve rapor alanı |
| `index.html/panel/panel.js` | Excel yükleme isteği, menü state güncelleme ve rapor renderi |
| `index.html/panel/panel.css` | Mevcut Excel rapor bileşeni stilleri |

## Dikkat

- Sunucuda `xlsx` paketi kurulu olmalıdır.
- Aktarım mevcut ürünü bulamazsa yeni ürün açmaz; ürün adı paneldeki adla eşleşmelidir.
- Aktarım sonrası rapordaki hata listesi kontrol edilmelidir.

## Hata Detaylari

Hatalı satır detayında sayfa, satır numarası, varsa ürün adı ve Excel satırından okunabilen hücre özeti gösterilir. Böylece yalnızca `Satır 4` bilgisiyle kalınmaz; hangi satırın hangi içerikle hataya düştüğü panelden görülebilir.
