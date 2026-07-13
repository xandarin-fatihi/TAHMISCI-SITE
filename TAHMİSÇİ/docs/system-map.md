# System Map

## Genel Harita

- Admin tarafi: panel login, menu yonetimi, menu ciktisi, recete yonetimi, Excel recete aktarimi, Excel urun bilgisi aktarimi, barista yetkilendirme, egitim/odev/sinav atama, aktivite takibi.
- Barista tarafi: kullanici adi/sifre ile recete girisi, recete goruntuleme, egitim, odev ve sinav akislari.
- Backend tarafi: JWT/cookie auth, aktif kullanici kontrolu, file store, API endpointleri, SSE.
- Oturum tarafi: admin ve recipe icin 10 dakikalik token/cookie, bitime 30 saniye kala frontend uyarisi, refresh endpointleri.

## Dosya Yolu -> Gorevi

| Dosya | Gorevi |
| --- | --- |
| `index.html/backend/src/server.js` | API endpointleri, aktif barista kontrolu, kapsam cozumleme, soru uretimi, puanlama, aktivite kaydi, Excel recete/urun import endpointleri |
| `index.html/backend/src/config.js` | Oturum suresi, domain, cookie ve env ayarlari |
| `index.html/backend/src/middleware/auth.js` | Admin/recipe JWT, cookie ve session sure ozeti islemleri |
| `index.html/backend/src/store/file-store.js` | Store okuma/yazma ve geriye uyumlu normalizasyon |
| `index.html/panel/index.html` | Admin kullanici, program atama ve kayit defteri bolumleri |
| `index.html/panel/panel.js` | Admin UI state, API cagrilari, menu ciktisi, Excel aktarimi, kullanici islemleri, kayit defteri renderlari |
| `index.html/panel/panel.css` | Admin filtre, coklu urun secimi, menu ciktisi, Excel raporu, kayit defteri ve detay stilleri |
| `index.html/recete/index.html` | Barista girişi, dinamik reçete grup merkezi ve program paneli |
| `index.html/recete/recete.js` | Recipe login, Excel kategori adlarından grup türetme, kategori filtreleme, içerik/hazırlanış modalı ve program akışları |
| `index.html/recete/recete.css` | Neon grup kartları, responsive reçete, eğitim, ödev ve sınav görünümü |
| `docs/excel-import-system.md` | Excel recete aktarim standardi |
| `docs/product-excel-import-system.md` | Excel urun ek bilgisi aktarim standardi |
| `docs/menu-output-tool.md` | Menu Ciktisi sistemi |

## Admin Akisi

1. Admin `POST /api/admin/login` ile oturum acar.
2. Panel `GET /api/admin/me` ile oturum bitis bilgisini alir.
3. Panel `GET /api/admin/recipe-access` ile kullanici, program ve aktivite verisini alir.
4. Admin barista olusturur, gunceller, pasiflestirir, tekrar aktif eder veya kalici siler.
5. Admin `quick_quiz`, `training`, `homework`, `exam`, `retraining` turlerinden program atar.
6. Kapsam `all`, `category`, `products`, `failed_items` olabilir.
7. Admin programlari kayit defterinde, aktiviteleri sekmeli kayit defterinde takip eder.
8. Admin Recete Duzenleme alanindan Excel aktarimi yapabilir.
9. Admin Urun Duzenleme alanindan kategori sayfali Excel ile kalori, alerjen ve urun icerigi aktarimi yapabilir.
10. Admin Menu Ciktisi sekmesinde canli menu verisinden TV ciktisi tasarlar.

## Barista Akisi

1. Barista `POST /api/recipe/login` ile giris yapar.
2. `GET /api/recipe/me` aktif kullanici durumunu dogrular.
3. `GET /api/recipes` recete verisini getirir.
4. Kategori adları `Sıcak`, `Soğuk`, `Tahmisci ... Specialler`, `DEMLEMELER` ve `HAZIRLIK` gruplarına ayrılır.
5. Barista ana karttan grubu açar; sıcak/soğuk gruplarında kategori sekmesi gösterilir. Special ana kartı iki kartlı ara seçim ekranına gider; seçilen special listesi sekmesiz açılır. Demleme ve hazırlık listeleri de sekmesizdir.
6. `GET /api/recipe/assignments` atanmış programları getirir.
7. Eğitim tamamlanır, ödev ilerlemesi kaydedilir veya sınav cevapları gönderilir.
8. Reçete görüntüleme ve program hareketleri `recipeActivity` alanına yazılır.

## API Haritasi

| Endpoint | Yetki | Gorev |
| --- | --- | --- |
| `POST /api/admin/login` | Admin sifresi | Admin oturumu |
| `GET /api/admin/me` | Admin | Admin oturum ve sure bilgisi |
| `POST /api/admin/session/refresh` | Admin | Admin oturumunu yeniler |
| `GET /api/admin/recipe-access` | Admin | Kullanici, program, aktivite verisi |
| `POST /api/admin/recipe-users` | Admin | Barista olusturur |
| `PUT /api/admin/recipe-users/:id` | Admin | Barista gunceller / aktif eder |
| `DELETE /api/admin/recipe-users/:id` | Admin | Baristayi pasif yapar |
| `DELETE /api/admin/recipe-users/:id/permanent` | Admin | Baristayi kalici siler |
| `POST /api/admin/recipe-assignments` | Admin | Egitim/odev/sinav atar |
| `DELETE /api/admin/recipe-assignments/:id` | Admin | Program kaydini siler |
| `POST /api/admin/recipes/import-excel` | Admin | Excel dosyasindan recete aktarimi yapar |
| `POST /api/admin/products/import-excel` | Admin | Excel dosyasindan mevcut urunlerin kalori, alerjen ve icerik alanlarini gunceller |
| `POST /api/recipe/login` | Main/admin origin | Barista girisi |
| `GET /api/recipe/me` | Recipe/admin | Oturum ve aktiflik dogrulama |
| `POST /api/recipe/session/refresh` | Recipe/admin | Recipe oturumunu yeniler |
| `GET /api/recipes` | Recipe/admin | Recete verisi |
| `GET /api/recipe/assignments` | Recipe | Barista programlari |
| `POST /api/recipe/assignments/:id/start` | Recipe | Program baslatma |
| `POST /api/recipe/assignments/:id/submit` | Recipe | Egitim tamamlama, odev ilerlemesi veya sinav puanlama |
| `POST /api/recipe/activity` | Recipe | Recete goruntuleme aktivitesi |

## Store ve State

| Katman | Kullanim |
| --- | --- |
| Backend store | `DATA_FILE` ile belirlenen JSON dosyasi |
| Store alanlari | `recipeState`, `recipeUsers`, `recipeAssignments`, `recipeActivity`, `admin` |
| Assignment alanlari | `assignmentKind`, `scopeType`, `recipeItems`, `questions`, `trainingContent`, `completedItems`, `failedItems` |
| Menu ciktisi state | `menuState.settings.menuOutput` |
| Recete Excel alanlari | `content`, `preparation`, `note`, `active`, `order`; dolu hücreler kendi alanına birebir aktarılır, boş hücre atlanır, `BOŞALT` hedef alanı temizler |
| Admin session storage | `tahmisci.backend.panel.token`, `tahmisci.panel.auth` |
| Recipe session storage | `tahmisci.backend.recipe.token`, `tahmisci.recipe.access` |
| Session sureleri | `ADMIN_SESSION_MINUTES`, `RECIPE_SESSION_MINUTES`, geriye uyumlu `JWT_EXPIRES_IN` |

## Aktivite Sekmeleri

| Sekme | Event tipleri |
| --- | --- |
| Giris | `login`, `login_failed` |
| Recete | `view_recipe`, `view_preparation` |
| Egitim | `training_assigned`, `training_started`, `training_completed`, `retry_training_suggested` |
| Odev | `homework_assigned`, `homework_started`, `homework_completed` |
| Sinav | `exam_assigned`, `exam_started`, `exam_completed`, `exam_failed`, eski assignment eventleri |
| Guvenlik | `recipe_user_deactivated`, `recipe_user_reactivated`, `recipe_user_permanently_deleted`, `login_failed` |

## Belirsiz / Dogrulanmali

- Canli Nginx yonlendirmeleri bu revizyonda degistirilmedi.
- Canli veri dosyasi deploy sonrasi yedeklenerek dogrulanmali.
