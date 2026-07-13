# Aşama 15 - Voltran Reçete Model Kararı

## Ana Karar

Voltran için ana reçete modeli aktif `TAH` modelidir.

Sebep:

- Veri dosyaları zaten birebir aynı.
- Aktif `TAH/recete/recete.js`, local sürümden daha gelişmiş.
- Aktif panel `content/preparation` ayrımını destekliyor.
- Backend tarafında reçete özel login, token, event ve validasyon var.
- Local taraf fikir/test alanı olarak kalmalı, ana kaynak olmamalı.

## Nihai Model

Hedef model:

```text
RecipeState
  categoryName
    productName
      sizeName
        content: string
        preparation: string
```

## Desteklenecek Eski Biçim

Eski düz metin reçeteler bozulmadan desteklenecek:

```js
"14 oz": "Double shot espresso"
```

Adapter bunu şu biçime çevirmeli:

```js
{
  content: "Double shot espresso",
  preparation: ""
}
```

## Standart Alanlar

| Alan | Zorunlu | Not |
|---|---|---|
| category | Evet | Kategori adı |
| product | Evet | Ürün adı |
| size | Evet | Ölçü/gramaj |
| content | Evet | Malzeme veya temel reçete |
| preparation | Hayır | Hazırlık/servis adımı |

## İleride Eklenebilir Alanlar

Bu alanlar şimdi eklenmemeli, ama modelde genişleme alanı olarak düşünülmeli:

| Alan | Amaç |
|---|---|
| tags | Arama/filtre |
| allergens | Alerjen bilgisi |
| ingredients | Ayrıştırılmış malzeme listesi |
| equipment | Ekipman |
| duration | Hazırlık süresi |
| temperature | Sıcak/soğuk ayrımı |
| version | Reçete revizyonu |

## Alınacak Kaynaklar

| Kaynak | Karar |
|---|---|
| `TAH/recipe-data.js` | Ana veri kaynağı |
| `TAH/recete/recete.js` | Ana reçete ekran mantığı |
| `TAH/panel/panel.js` | Ana admin reçete editörü |
| `TAH/backend/src/*` | Ana backend/güvenlik kaynağı |
| Local reçete | Sadece test/local review referansı |

## Alınmayacaklar

| Parça | Neden |
|---|---|
| Local sabit PIN'i ana sisteme taşımak | Güvenlik seviyesi düşük |
| Local reçete JS'ini ana kaynak yapmak | Aktif TAH daha gelişmiş |
| Veri dosyasını hemen dönüştürmek | Veri zaten çalışıyor; risk gereksiz |
| Backend endpointlerini yeniden yazmak | Mevcut endpointler yeterli |

## Uygulama Kararı

Aşama 16'da doğrudan veri değişimi yapılmayacak. Önce ortak bir adapter/normalizer dosyası hazırlanacak. Bu dosya aktif ekrana hemen bağlanmayacak; önce test edilecek.

Hedef:

```text
raw recipe state -> normalizeRecipeItem -> normalized recipe state -> panel/recete/backend uyumlu çıktı
```
