# Aşama 15 - Reçete Model Karşılaştırması

## İncelenen Yapı

Bu klasörde aktif gövde `TAH/`, local inceleme gövdesi `TAH - ÖZEL LOCAL İNCELEME/` olarak görünüyor.

Önceki doküman referansları (`docs/10-recete-model-karari.md`, `docs/11-admin-backend-entegrasyon-plani.md`) bu kökte bulunmadı. Bu nedenle karar mevcut dosya incelemesine göre verildi.

## İncelenen Dosyalar

| Alan | Dosya |
|---|---|
| Aktif reçete verisi | `TAH/recipe-data.js` |
| Local reçete verisi | `TAH - ÖZEL LOCAL İNCELEME/recipe-data.js` |
| Aktif reçete ekranı | `TAH/recete/recete.js` |
| Local reçete ekranı | `TAH - ÖZEL LOCAL İNCELEME/local-inceleme için/local-recete/recete.js` |
| Aktif panel | `TAH/panel/panel.js` |
| Local panel | `TAH - ÖZEL LOCAL İNCELEME/local-inceleme için/panel-local/panel.js` |
| Backend | `TAH/backend/src/server.js`, `validators.js`, `middleware/auth.js`, `store/file-store.js` |

## Veri Özeti

`TAH/recipe-data.js` ve local `recipe-data.js` SHA256 hash olarak birebir aynı çıktı.

| Ölçüm | Aktif TAH | Local |
|---|---:|---:|
| Kategori | 7 | 7 |
| Ürün | 77 | 77 |
| Ölçü/reçete satırı | 213 | 213 |
| Nesne tipli reçete | 191 | 191 |
| Düz metin reçete | 22 | 22 |

## Mevcut Veri Modeli

Model üç seviyeli:

```text
category -> product -> size -> recipe
```

`recipe` iki biçimde gelebiliyor:

```js
"14 oz": "Double shot espresso"
```

veya:

```js
"14 oz": {
  content: "Malzeme / ölçü",
  preparation: "Hazırlık adımı"
}
```

## Aktif TAH Reçete Ekranı

Aktif taraf daha gelişmiş:

| Özellik | Durum |
|---|---|
| Backend reçete login | Var: `/api/recipe/login` |
| Reçete token | Var: `tahmisci.backend.recipe.token` |
| Reçete oturum kontrolü | Var: `/api/recipe/me` |
| Backend reçete çekme | Var: `/api/recipes` |
| SSE canlı güncelleme | Var: `/api/recipes/events` |
| BroadcastChannel | Var |
| İçerik / hazırlık paneli | Var |
| `content/preparation` normalize | Var |

## Local Reçete Ekranı

Local taraf daha basit:

| Özellik | Durum |
|---|---|
| Local PIN | Var: `2135` |
| Backend admin login denemesi | Var ama `/api/admin/login` üzerinden |
| Reçete token ayrımı | Yok |
| İçerik / hazırlık paneli | Yok |
| Düz metin normalize | Var |
| `content/preparation` desteği | Sınırlı |

## Admin Panel

Aktif panel reçete yönetimi açısından güçlü:

| Özellik | Aktif TAH |
|---|---|
| Kategori ekle/sil | Var |
| Ürün ekle/sil | Var |
| Ölçü ekle/sil | Var |
| `content/preparation` düzenleme | Var |
| Backend kaydetme | Var: `PUT /api/recipes` |
| LocalStorage fallback | Var |
| BroadcastChannel bildirimi | Var |
| Backend event dinleme | Var |

## Backend

Backend zaten reçete entegrasyonuna hazır:

| Endpoint | Amaç |
|---|---|
| `POST /api/recipe/login` | Reçete özel giriş |
| `GET /api/recipe/me` | Reçete oturum doğrulama |
| `GET /api/recipes` | Reçete state okuma |
| `PUT /api/recipes` | Admin ile reçete state kaydetme |
| `GET /api/recipes/events` | Reçete canlı güncelleme |

## Ortak / Eksik / Fazla Alanlar

| Alan | Aktif TAH | Local | Karar |
|---|---|---|---|
| `content` | Var | Veri içinde var | Ana alan |
| `preparation` | Var | Veri içinde var | Ana alan |
| Düz metin reçete | Var | Var | Adapter ile desteklenmeli |
| Kategori/ürün/ölçü yapısı | Aynı | Aynı | Korunmalı |
| Reçete token | Var | Yok | Aktif TAH korunmalı |
| Local PIN | Yok | Var | Sadece local review için kalmalı |
| Backend event | Var | Var ama daha basit | Aktif TAH esas alınmalı |

## Hızlı Karar

Veri taşımaya gerek yok. Model zaten aynı veri üstünden çalışıyor. Hızlandırılmış entegrasyon için doğru yol:

1. Aktif `TAH` reçete modelini ana kaynak kabul et.
2. Local incelemeyi aktif modelin test kopyası haline getir.
3. Düz metin ve `content/preparation` farkını adapter ile standartlaştır.
4. Sonra panel/backend aynı adapter mantığına bağlansın.
