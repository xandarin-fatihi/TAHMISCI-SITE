# Hızlandırılmış Toplu Entegrasyon Planı

## Hedef

Voltran entegrasyonunu artık tek tek analiz yerine kontrollü toplu bloklara bölerek hızlandırmak.

Ana kural: çalışan aktif `TAH` yapısı bozulmayacak; her büyük modül önce pasif/izole hazırlanacak, sonra local test, sonra aktif bağlantı.

## Mevcut Durum Kararı

| Alan | Karar |
|---|---|
| Ana gövde | `TAH/` |
| Local inceleme | `TAH - ÖZEL LOCAL İNCELEME/` |
| Reçete ana model | Aktif `TAH` |
| Backend ana kaynak | Aktif `TAH/backend` |
| Admin ana kaynak | Aktif `TAH/panel` |
| Local PIN sistemi | Sadece local review |

## Hızlandırılmış Sıra

| Sıra | Aşama | İş | Risk |
|---:|---|---|---|
| 1 | Aşama 16 | Reçete adapter dosyası oluştur | Düşük |
| 2 | Aşama 17 | Aktif reçete ve paneldeki duplicate normalize fonksiyonlarını adapter ile eşleme planı | Orta |
| 3 | Aşama 18 | Local review reçete ekranını aktif adapter ile test et | Orta |
| 4 | Aşama 19 | Admin panel reçete editörünü adapter standardına bağla | Orta |
| 5 | Aşama 20 | Backend validator/store ile adapter modelini eşitle | Orta/Yüksek |
| 6 | Aşama 21 | Sipariş/kasa modülü için `features/orders` iskeleti | Orta |
| 7 | Aşama 22 | QR menü + sipariş sepeti ilk pasif entegrasyon | Yüksek |
| 8 | Aşama 23 | Yayın öncesi test, temizlik, dokümantasyon | Orta |

## Toplu Eylem Mantığı

Entegrasyonu hızlandırmak için aynı anda şu kararlar alındı:

1. Veri dosyası taşınmayacak; çünkü aktif ve local veri zaten aynı.
2. Aktif `TAH` daha gelişmiş olduğu için ana kaynak kabul edilecek.
3. Local yapı ayrı ürün gibi geliştirilmeyecek; inceleme/test alanı olacak.
4. Kod tekrarları adapter seviyesinde azaltılacak.
5. Backend güvenlik yapısı korunacak; local PIN ana sisteme alınmayacak.
6. Sipariş/kasa entegrasyonu reçete modelinden sonra başlayacak.

## İlk Hızlı Uygulama Paketi

Aşama 16-18 tek paket gibi yürütülebilir:

```text
16: Adapter oluştur
17: Adapter bağlantı noktalarını işaretle
18: Local review üzerinde adapter test et
```

Bu üç aşama tamamlanınca reçete/panel/backend gerçek refactoruna daha güvenli girilir.

## Şimdilik Yapılmayanlar

| İş | Neden Bekliyor |
|---|---|
| Aktif reçete dosyasını dönüştürmek | Veri zaten çalışıyor |
| Panel normalize fonksiyonlarını hemen silmek | Önce adapter test edilmeli |
| Backend validator değiştirmek | API riskli |
| Sipariş/kasa taşımak | Reçete ve admin modeli netleşmeli |
| Local PIN'i ana sisteme almak | Güvenlik açısından zayıf |

## Net Sonraki Komut

Bir sonraki uygulama için `docs/37-asama-16-recete-adapter-plani.md` içindeki Aşama 16 promptu kullanılmalı.
