(function () {
  "use strict";
  const catalog = {
  "categories": [
    {
      "id": "all",
      "name": "Tümü",
      "icon": "fas fa-border-all",
      "subcategories": []
    },
    {
      "id": 1,
      "name": "SOĞUKLAR",
      "icon": "fas fa-snowflake",
      "productCount": 85,
      "subcategories": [
        {
          "id": 101,
          "name": "SOĞUK İÇECEKLER",
          "icon": "fas fa-snowflake",
          "productCount": 23
        },
        {
          "id": 102,
          "name": "SOĞUK KAHVELER",
          "icon": "fas fa-snowflake",
          "productCount": 9
        },
        {
          "id": 103,
          "name": "SOĞUK AROMALI KAHVELER",
          "icon": "fas fa-snowflake",
          "productCount": 15
        },
        {
          "id": 104,
          "name": "MATCHA LATTE",
          "icon": "fas fa-snowflake",
          "productCount": 7
        },
        {
          "id": 105,
          "name": "TAHMİSCİ SPECIAL",
          "icon": "fas fa-snowflake",
          "productCount": 31
        }
      ]
    },
    {
      "id": 2,
      "name": "SICAKLAR",
      "icon": "fas fa-mug-hot",
      "productCount": 59,
      "subcategories": [
        {
          "id": 201,
          "name": "SICAK İÇECEKLER",
          "icon": "fas fa-mug-hot",
          "productCount": 6
        },
        {
          "id": 202,
          "name": "SICAK KAHVELER",
          "icon": "fas fa-mug-hot",
          "productCount": 13
        },
        {
          "id": 203,
          "name": "SICAK AROMALI KAHVELER",
          "icon": "fas fa-mug-hot",
          "productCount": 17
        },
        {
          "id": 204,
          "name": "TAHMİSCİ SPECIAL",
          "icon": "fas fa-mug-hot",
          "productCount": 16
        },
        {
          "id": 205,
          "name": "MATCHA LATTE",
          "icon": "fas fa-mug-hot",
          "productCount": 7
        }
      ]
    },
    {
      "id": 3,
      "name": "TÜRK KAHVELERİ",
      "icon": "fas fa-mortar-pestle",
      "productCount": 5,
      "subcategories": [
        {
          "id": 301,
          "name": "TÜRK KAHVELERİ",
          "icon": "fas fa-mortar-pestle",
          "productCount": 5
        }
      ]
    },
    {
      "id": 4,
      "name": "TATLI & SANDWICH",
      "icon": "fas fa-cookie-bite",
      "productCount": 41,
      "subcategories": [
        {
          "id": 401,
          "name": "SANDVİÇLER",
          "icon": "fas fa-cookie-bite",
          "productCount": 9
        },
        {
          "id": 402,
          "name": "TATLILAR",
          "icon": "fas fa-cookie-bite",
          "productCount": 32
        }
      ]
    },
    {
      "id": 5,
      "name": "MEŞRUBAT",
      "icon": "fas fa-bottle-water",
      "productCount": 3,
      "subcategories": [
        {
          "id": 501,
          "name": "MEŞRUBAT",
          "icon": "fas fa-bottle-water",
          "productCount": 3
        }
      ]
    },
    {
      "id": 6,
      "name": "KASA ÖNÜ",
      "icon": "fas fa-basket-shopping",
      "productCount": 12,
      "subcategories": [
        {
          "id": 601,
          "name": "KASA ÖNÜ",
          "icon": "fas fa-basket-shopping",
          "productCount": 12
        }
      ]
    },
    {
      "id": 7,
      "name": "PAKETLİ ÜRÜN",
      "icon": "fas fa-bag-shopping",
      "productCount": 10,
      "subcategories": [
        {
          "id": 701,
          "name": "TÜRK KAHVELERİ",
          "icon": "fas fa-bag-shopping",
          "productCount": 5
        },
        {
          "id": 702,
          "name": "KAHVE ÇEKİRDEKLERİ",
          "icon": "fas fa-bag-shopping",
          "productCount": 5
        }
      ]
    }
  ],
  "products": [
    {
      "id": 1,
      "name": "MANGO FROZEN",
      "description": "Buzlu meyve içeceği",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": "popular",
      "popular": 1,
      "variants": [
        {
          "name": " KÜÇÜK",
          "price": 185
        },
        {
          "name": " ORTA",
          "price": 200
        },
        {
          "name": "BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 1,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 2,
      "name": "KARADUT FROZEN",
      "description": "Buzlu meyve içeceği",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": "popular",
      "popular": 1,
      "variants": [
        {
          "name": "KARADUT FROZEN KÜÇÜK",
          "price": 185
        },
        {
          "name": "KARADUT FROZEN ORTA",
          "price": 200
        },
        {
          "name": " BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 2,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 3,
      "name": "BÖĞÜRTLEN FROZEN",
      "description": "Buzlu meyve içeceği",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": "popular",
      "popular": 1,
      "variants": [
        {
          "name": "BÖĞÜRTLEN FROZEN KÜÇÜK",
          "price": 185
        },
        {
          "name": "BÖĞÜRTLEN FROZEN ORTA",
          "price": 200
        },
        {
          "name": "BÖĞÜRTLEN FROZEN BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 3,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 4,
      "name": "KARPUZ FROZEN",
      "description": "Buzlu meyve içeceği",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": "popular",
      "popular": 1,
      "variants": [
        {
          "name": "KARPUZ FROZEN KÜÇÜK",
          "price": 185
        },
        {
          "name": "KARPUZ FROZEN ORTA",
          "price": 200
        },
        {
          "name": "KARPUZ FROZEN BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 4,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 5,
      "name": "ÇİLEK MILKSHAKE",
      "description": "Sütlü ve yoğun içecek",
      "basePrice": 195,
      "priceLabel": "₺195 - ₺225",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": "popular",
      "popular": 1,
      "variants": [
        {
          "name": "ÇİLEK MILKSHAKE KÜÇÜK",
          "price": 195
        },
        {
          "name": "ÇİLEK MILKSHAKE ORTA",
          "price": 210
        },
        {
          "name": "ÇİLEK MILKSHAKE BÜYÜK",
          "price": 225
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 5,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 6,
      "name": "VANİLYA MILKSHAKE",
      "description": "Sütlü ve yoğun içecek",
      "basePrice": 195,
      "priceLabel": "₺195 - ₺225",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": "popular",
      "popular": 1,
      "variants": [
        {
          "name": "VANİLYA MILKSHAKE KÜÇÜK",
          "price": 195
        },
        {
          "name": "VANİLYA MILKSHAKE ORTA",
          "price": 210
        },
        {
          "name": "VANİLYA MILKSHAKE BÜYÜK",
          "price": 225
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 6,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 7,
      "name": "LOTUS MILKSHAKE",
      "description": "Sütlü ve yoğun içecek",
      "basePrice": 195,
      "priceLabel": "₺195 - ₺225",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": "popular",
      "popular": 1,
      "variants": [
        {
          "name": "LOTUS MILKSHAKE KÜÇÜK",
          "price": 195
        },
        {
          "name": "LOTUS MILKSHAKE ORTA",
          "price": 210
        },
        {
          "name": "LOTUS MILKSHAKE BÜYÜK",
          "price": 225
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 7,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 8,
      "name": "CARAMEL MILKSHAKE",
      "description": "Sütlü ve yoğun içecek",
      "basePrice": 195,
      "priceLabel": "₺195 - ₺225",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": "popular",
      "popular": 1,
      "variants": [
        {
          "name": "CARAMEL MILKSHAKE KÜÇÜK",
          "price": 195
        },
        {
          "name": "CARAMEL MILKSHAKE ORTA",
          "price": 210
        },
        {
          "name": "CARAMEL MILKSHAKE BÜYÜK",
          "price": 225
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 8,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 9,
      "name": "ÇİKOLATA MILKSHAKE",
      "description": "Sütlü ve yoğun içecek",
      "basePrice": 195,
      "priceLabel": "₺195 - ₺225",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ÇİKOLATA MILKSHAKE KÜÇÜK",
          "price": 195
        },
        {
          "name": "ÇİKOLATA MILKSHAKE ORTA",
          "price": 210
        },
        {
          "name": "ÇİKOLATA MILKSHAKE BÜYÜK",
          "price": 225
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 9,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 10,
      "name": "Cool Lime",
      "description": "Soğuk içecekler",
      "basePrice": 175,
      "priceLabel": "₺175 - ₺200",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "Cool Lime KÜÇÜK",
          "price": 175
        },
        {
          "name": "Cool Lime ORTA",
          "price": 190
        },
        {
          "name": "Cool Lime BÜYÜK",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 10,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 11,
      "name": "ÇİLEK COOL LIME",
      "description": "Soğuk içecekler",
      "basePrice": 190,
      "priceLabel": "₺190 - ₺220",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ÇİLEK COOL LIME KÜÇÜK",
          "price": 190
        },
        {
          "name": "ÇİLEK COOL LIME ORTA",
          "price": 210
        },
        {
          "name": "ÇİLEK COOL LIME BÜYÜK",
          "price": 220
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 11,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 12,
      "name": "KARPUZ COOL LIME",
      "description": "Soğuk içecekler",
      "basePrice": 190,
      "priceLabel": "₺190 - ₺220",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "KARPUZ COOL LIME KÜÇÜK",
          "price": 190
        },
        {
          "name": "KARPUZ COOL LIME ORTA",
          "price": 210
        },
        {
          "name": "KARPUZ COOL LIME BÜYÜK",
          "price": 220
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 12,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 13,
      "name": "VİŞNE COOL LIME",
      "description": "Soğuk içecekler",
      "basePrice": 190,
      "priceLabel": "₺190 - ₺220",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "VİŞNE COOL LIME KÜÇÜK",
          "price": 190
        },
        {
          "name": "VİŞNE COOL LIME ORTA",
          "price": 210
        },
        {
          "name": "VİŞNE COOL LIME BÜYÜK",
          "price": 220
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 13,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 14,
      "name": "KARADUT COOL LIME",
      "description": "Soğuk içecekler",
      "basePrice": 190,
      "priceLabel": "₺190 - ₺220",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "KARADUT COOL LIME KÜÇÜK",
          "price": 190
        },
        {
          "name": "KARADUT COOL LIME ORTA",
          "price": 210
        },
        {
          "name": "KARADUT COOL LIME BÜYÜK",
          "price": 220
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 14,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 15,
      "name": "BÖĞÜRTLEN COOL LIME",
      "description": "Soğuk içecekler",
      "basePrice": 190,
      "priceLabel": "₺190 - ₺220",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "BÖĞÜRTLEN COOL LIME KÜÇÜK",
          "price": 190
        },
        {
          "name": "BÖĞÜRTLEN COOL LIME ORTA",
          "price": 210
        },
        {
          "name": "BÖĞÜRTLEN COOL LIME BÜYÜK",
          "price": 220
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 15,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 16,
      "name": "BERRY HIBISCUS",
      "description": "Soğuk içecekler",
      "basePrice": 175,
      "priceLabel": "₺175 - ₺200",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "BERRY HIBISCUS KÜÇÜK",
          "price": 175
        },
        {
          "name": "BERRY HIBISCUS ORTA",
          "price": 190
        },
        {
          "name": "BERRY HIBISCUS BÜYÜK",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 16,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 17,
      "name": "LİMONATA",
      "description": "Serinletici limon aroması",
      "basePrice": 150,
      "priceLabel": "₺150 - ₺170",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "LİMONATA KÜÇÜK",
          "price": 150
        },
        {
          "name": "LİMONATA ORTA",
          "price": 165
        },
        {
          "name": "LİMONATA BÜYÜK",
          "price": 170
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 17,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 18,
      "name": "KARAMEL FRAPPE",
      "description": "Soğuk içecekler",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "KARAMEL FRAPPE KÜÇÜK",
          "price": 185
        },
        {
          "name": "KARAMEL FRAPPE ORTA",
          "price": 200
        },
        {
          "name": "KARAMEL FRAPPE BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 18,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 19,
      "name": "VANİLYA FRAPPE",
      "description": "Soğuk içecekler",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "VANİLYA FRAPPE KÜÇÜK",
          "price": 185
        },
        {
          "name": "VANİLYA FRAPPE ORTA",
          "price": 200
        },
        {
          "name": "VANİLYA FRAPPE BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 19,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 20,
      "name": "BİSKÜVİ FRAPPE",
      "description": "Soğuk içecekler",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "BİSKÜVİ FRAPPE KÜÇÜK",
          "price": 185
        },
        {
          "name": "BİSKÜVİ FRAPPE 16 OIZ",
          "price": 200
        },
        {
          "name": "BİSKUVİ FRAPPE BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 20,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 21,
      "name": "ÇİKOLATA FRAPPE",
      "description": "Soğuk içecekler",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ÇİKOLATA FRAPPE KÜÇÜK",
          "price": 185
        },
        {
          "name": "ÇİKOLATA FRAPPE ORTA",
          "price": 200
        },
        {
          "name": "ÇİKOLATA FRAPPE BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 21,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 22,
      "name": "MUZLU MILKSAHE",
      "description": "Soğuk içecekler",
      "basePrice": 195,
      "priceLabel": "₺195 - ₺225",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "MUZLU MILKSHAKE KÜÇÜK",
          "price": 195
        },
        {
          "name": "MUZLU MILKSHAKE ORTA",
          "price": 210
        },
        {
          "name": "MUZLU MILKSHAKE BÜYÜK",
          "price": 225
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 22,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 23,
      "name": "FRAMBUAZLI MILKSHAKE",
      "description": "Sütlü ve yoğun içecek",
      "basePrice": 195,
      "priceLabel": "₺195 - ₺225",
      "oldPrice": null,
      "category": 101,
      "categoryName": "SOĞUK İÇECEKLER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "FRAMBUAZLI MILKSHAKE KÜÇÜK",
          "price": 195
        },
        {
          "name": "FRAMBUAZLI MILKSHAKE ORTA",
          "price": 210
        },
        {
          "name": "FRAMBUAZLI MILKSHAKE BÜYÜK",
          "price": 225
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 23,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 24,
      "name": "AFFAGATO",
      "description": "Soğuk kahveler",
      "basePrice": 170,
      "priceLabel": "₺170",
      "oldPrice": null,
      "category": 102,
      "categoryName": "SOĞUK KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 24,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 25,
      "name": "ICE FİLTRE KAHVE",
      "description": "Filtre kahve",
      "basePrice": 130,
      "priceLabel": "₺130 - ₺160",
      "oldPrice": null,
      "category": 102,
      "categoryName": "SOĞUK KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE FİLTRE KAHVE KÜÇÜK",
          "price": 130
        },
        {
          "name": "ICE FİLTRE KAHVE ORTA",
          "price": 145
        },
        {
          "name": "ICE FİLTRE KAHVE BÜYÜK",
          "price": 160
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 25,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 26,
      "name": "ICE AMERICANO",
      "description": "Espresso + su",
      "basePrice": 150,
      "priceLabel": "₺150 - ₺180",
      "oldPrice": null,
      "category": 102,
      "categoryName": "SOĞUK KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE AMERICANO KÜÇÜK",
          "price": 150
        },
        {
          "name": "ICE AMERICANO ORTA",
          "price": 165
        },
        {
          "name": "ICE AMERICANO BÜYÜK",
          "price": 180
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 26,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 27,
      "name": "ICE LATTE",
      "description": "Espresso + süt",
      "basePrice": 160,
      "priceLabel": "₺160 - ₺190",
      "oldPrice": null,
      "category": 102,
      "categoryName": "SOĞUK KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE LATTE KÜÇÜK",
          "price": 160
        },
        {
          "name": "ICE LATTE ORTA",
          "price": 175
        },
        {
          "name": "ICE LATTE BÜYÜK",
          "price": 190
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 27,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 28,
      "name": "ICE FLAT WHITE",
      "description": "Çift espresso + süt",
      "basePrice": 175,
      "priceLabel": "₺175 - ₺200",
      "oldPrice": null,
      "category": 102,
      "categoryName": "SOĞUK KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE FLAT WHITE KÜÇÜK",
          "price": 175
        },
        {
          "name": "ICE FLAT WHITE ORTA",
          "price": 190
        },
        {
          "name": "ICE FLAT WHITE BÜYÜK",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 28,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 29,
      "name": "ICE CAPPUCINO",
      "description": "Espresso + süt köpüğü",
      "basePrice": 160,
      "priceLabel": "₺160 - ₺190",
      "oldPrice": null,
      "category": 102,
      "categoryName": "SOĞUK KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE CAPPUCINO KÜÇÜK",
          "price": 160
        },
        {
          "name": "ICE CAPPUCINO ORTA",
          "price": 175
        },
        {
          "name": "ICE CAPPUCINO BÜYÜK",
          "price": 190
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 29,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 30,
      "name": "JAPONESE COLD BREW",
      "description": "Soğuk kahveler",
      "basePrice": 270,
      "priceLabel": "₺270",
      "oldPrice": null,
      "category": 102,
      "categoryName": "SOĞUK KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 30,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 31,
      "name": "REDEYE",
      "description": "Soğuk kahveler",
      "basePrice": 160,
      "priceLabel": "₺160 - ₺185",
      "oldPrice": null,
      "category": 102,
      "categoryName": "SOĞUK KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "REDEYE KÜÇÜK",
          "price": 160
        },
        {
          "name": "REDEYE ORTA",
          "price": 175
        },
        {
          "name": "REDEYE BÜYÜK",
          "price": 185
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 31,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 32,
      "name": "BLACKEYE",
      "description": "Soğuk kahveler",
      "basePrice": 170,
      "priceLabel": "₺170 - ₺195",
      "oldPrice": null,
      "category": 102,
      "categoryName": "SOĞUK KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "BLACKEYE KÜÇÜK",
          "price": 170
        },
        {
          "name": "BLACKEYE ORTA",
          "price": 185
        },
        {
          "name": "BLACKEYE BÜYÜK",
          "price": 195
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 32,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 33,
      "name": "ICE CARAMEL LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE CARAMEL LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICE CARAMEL LATTE ORTA",
          "price": 200
        },
        {
          "name": "ICE CARAMEL LATTE BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 33,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 34,
      "name": "ICE TOFFENUTT LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE TOFFENUT LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICE TOFFENUT LATTE ORTA",
          "price": 200
        },
        {
          "name": "ICE TOFFENUT LATTE BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 34,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 35,
      "name": "ICE VANİLYA LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE VANİLYA LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICE VANİLYA LATTE ORTA",
          "price": 200
        },
        {
          "name": "ICE VANİLYA LATTE BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 35,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 36,
      "name": "ICE COOKIE LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE COOKIE LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICE COOKIE LATTE ORTA",
          "price": 200
        },
        {
          "name": "ICE COOKIE LATTE BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 36,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 37,
      "name": "ICE LOTUS LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE LOTUS LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICE LOTUS LATTE ORTA",
          "price": 200
        },
        {
          "name": "ICE LOTUS LATTE BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 37,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 38,
      "name": "ICE BADEM LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE BADEM LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICE BADEM LATTE ORTA",
          "price": 200
        },
        {
          "name": "ICE BADEM LATTE BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 38,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 39,
      "name": "ICE IRISH CREAM LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE IRISH CREAM LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICE IRISH CREAM LATTE ORTA",
          "price": 200
        },
        {
          "name": "ICE IRISH CREAM LATTE BÜYÜK",
          "price": 215
        },
        {
          "name": "ICE IRISH CREAM LATTE BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 39,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 40,
      "name": "ICE COCOUNAT LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE COCONUT LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICE COCONUT LATTE ORTA",
          "price": 200
        },
        {
          "name": "ICE COCONUT LATTE BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 40,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 41,
      "name": "ICE PUMPKIN SPICE",
      "description": "Soğuk aromalı kahveler",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE PUMPKIN SPICE KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICE PUMPKIN SPICE ORTA",
          "price": 200
        },
        {
          "name": "ICE PUMPKIN SPICE BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 41,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 42,
      "name": "ICE ANTEP LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE ANTEP LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICE ANTEP LATTE ORTA",
          "price": 200
        },
        {
          "name": "ICE ANTEP LATTE BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 42,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 43,
      "name": "ICE CARAMEL MACHIATO",
      "description": "Soğuk aromalı kahveler",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE CARAMEL MACHIATO KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICE CARAMEL MACHIATO ORTA",
          "price": 200
        },
        {
          "name": "ICE CARAMEL MACHIATO BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 43,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 44,
      "name": "ICE MOCHA",
      "description": "Espresso + çikolata + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE MOCHA KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICEMOCHA ORTA",
          "price": 200
        },
        {
          "name": "ICE MOCHA BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 44,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 45,
      "name": "ICE WHITE MOCHA",
      "description": "Espresso + çikolata + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE WHITE MOCHA KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICE WHITE MOCHA ORTA",
          "price": 200
        },
        {
          "name": "ICE WHITE MOCHA BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 45,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 46,
      "name": "ICE SALTED CARAMEL",
      "description": "Soğuk aromalı kahveler",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE SALTED CARAMEL KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICE SALTED CARAMEL ORTA",
          "price": 200
        },
        {
          "name": "ICE SALTED CARAMEL BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 46,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 47,
      "name": "ICE CARAMEL MOCHA",
      "description": "Espresso + çikolata + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺215",
      "oldPrice": null,
      "category": 103,
      "categoryName": "SOĞUK AROMALI KAHVELER",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE CARAMEL MOCHA KÜÇÜK",
          "price": 185
        },
        {
          "name": "ICE CARAMEL MOCHA ORTA",
          "price": 200
        },
        {
          "name": "ICE CARAMEL MOCHA BÜYÜK",
          "price": 215
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 47,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 48,
      "name": "MATCHA LATTE",
      "description": "Matcha + süt",
      "basePrice": 200,
      "priceLabel": "₺200 - ₺240",
      "oldPrice": null,
      "category": 104,
      "categoryName": "MATCHA LATTE",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE Matcha latte 14 oz",
          "price": 200
        },
        {
          "name": "ICE Matcha Latte ORTA",
          "price": 220
        },
        {
          "name": "ICE Matcha Latte BÜYÜK",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 48,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 49,
      "name": "ÇİLEKLİ MATCHA LATTE",
      "description": "Matcha + süt",
      "basePrice": 230,
      "priceLabel": "₺230 - ₺270",
      "oldPrice": null,
      "category": 104,
      "categoryName": "MATCHA LATTE",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE çilekli matcha latte 14 oz",
          "price": 230
        },
        {
          "name": "ICE çilekli matcha latte 16 oz",
          "price": 250
        },
        {
          "name": "ICE Çilekli Matcha latte 20 oz",
          "price": 270
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 49,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 50,
      "name": "VANLİYA MATCHA LATTE",
      "description": "Matcha + süt",
      "basePrice": 230,
      "priceLabel": "₺230 - ₺270",
      "oldPrice": null,
      "category": 104,
      "categoryName": "MATCHA LATTE",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE Vanilya Matcha latte 14 oz",
          "price": 230
        },
        {
          "name": "ICE  Vanilya Matcha Latte 16 oz",
          "price": 250
        },
        {
          "name": "ICE Vanilya Match Latte 20 oz",
          "price": 270
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 50,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 51,
      "name": "FRAMBUAZ MATCHA LATTE",
      "description": "Matcha + süt",
      "basePrice": 230,
      "priceLabel": "₺230 - ₺270",
      "oldPrice": null,
      "category": 104,
      "categoryName": "MATCHA LATTE",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE Frambuaz Matcha Latte 14 oz",
          "price": 230
        },
        {
          "name": "ICE Frambuaz Matcha Latte 16 oz",
          "price": 250
        },
        {
          "name": "ICE Frambuaz Matcha Latte 20 oz",
          "price": 270
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 51,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 52,
      "name": "MANGO MATCHA LATTE",
      "description": "Matcha + süt",
      "basePrice": 230,
      "priceLabel": "₺230 - ₺270",
      "oldPrice": null,
      "category": 104,
      "categoryName": "MATCHA LATTE",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE Mango Matcha Latte 14 oz",
          "price": 230
        },
        {
          "name": "ICE Mango Matcha Latte 16 oz",
          "price": 250
        },
        {
          "name": "ICE Mango Matcha Latte 20 oz",
          "price": 270
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 52,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 53,
      "name": "PASSION FRUIT MATCHA LATTE",
      "description": "Matcha + süt",
      "basePrice": 230,
      "priceLabel": "₺230 - ₺270",
      "oldPrice": null,
      "category": 104,
      "categoryName": "MATCHA LATTE",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE PASSION FRUIT KÜÇÜK",
          "price": 230
        },
        {
          "name": "ICE PASSION FRUIT ORTA",
          "price": 250
        },
        {
          "name": "ICE PASSION FRUIT BÜYÜK",
          "price": 270
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 53,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 54,
      "name": "NAR MATCHA LATTE",
      "description": "Matcha + süt",
      "basePrice": 230,
      "priceLabel": "₺230 - ₺270",
      "oldPrice": null,
      "category": 104,
      "categoryName": "MATCHA LATTE",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE NAR MATCHA LATTE KÜÇÜK",
          "price": 230
        },
        {
          "name": "ICE NAR MATCHA LATTE ORTA",
          "price": 250
        },
        {
          "name": "ICE NAR MATCHA LATTE BÜYÜK",
          "price": 270
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 54,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 55,
      "name": "TAHMİSCİCY SOĞUK",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "TAHMİSCİCY SOĞUK KÜÇÜK",
          "price": 225
        },
        {
          "name": "TAHMİSCİCY SOĞUK ORTA",
          "price": 240
        },
        {
          "name": "TAHMİSCİCY SOĞUK BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 55,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 56,
      "name": "White Nut",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "Ice White Nut KÜÇÜK",
          "price": 225
        },
        {
          "name": "Ice White Nut ORTA",
          "price": 240
        },
        {
          "name": "Ice White Nut 20 oz",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 56,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 57,
      "name": "KUZU KULAĞI",
      "description": "Tahmisci specıal",
      "basePrice": 240,
      "priceLabel": "₺240 - ₺265",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "KUZU KULAĞI KÜÇÜK",
          "price": 240
        },
        {
          "name": "KUZU KULAĞI ORTA",
          "price": 250
        },
        {
          "name": "KUZU KULAĞI BÜYÜK",
          "price": 265
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 57,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 58,
      "name": "Mojito",
      "description": "Tahmisci specıal",
      "basePrice": 180,
      "priceLabel": "₺180 - ₺205",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "Mojito KÜÇÜK",
          "price": 180
        },
        {
          "name": "Mojito ORTA",
          "price": 195
        },
        {
          "name": "Mojito BÜYÜK",
          "price": 205
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 58,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 59,
      "name": "KARADUT MOJITO",
      "description": "Tahmisci specıal",
      "basePrice": 200,
      "priceLabel": "₺200 - ₺225",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "KARADUT MOJITO KÜÇÜK",
          "price": 200
        },
        {
          "name": "KARADUT MOJITO ORTA",
          "price": 215
        },
        {
          "name": "KARADUT MOJITO BÜYÜK",
          "price": 225
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 59,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 60,
      "name": "BÖĞÜRTLEN MOJITO",
      "description": "Tahmisci specıal",
      "basePrice": 200,
      "priceLabel": "₺200 - ₺225",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "BÖĞÜRTLEN MOJITO KÜÇÜK",
          "price": 200
        },
        {
          "name": "BÖĞÜRTLEN MOJITO ORTA",
          "price": 215
        },
        {
          "name": "BÖĞÜRTLEN MOJITO BÜYÜK",
          "price": 225
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 60,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 61,
      "name": "MANGO MOJITO",
      "description": "Tahmisci specıal",
      "basePrice": 200,
      "priceLabel": "₺200 - ₺225",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "MANGO MOJITO KÜÇÜK",
          "price": 200
        },
        {
          "name": "MANGO MOJITO ORTA",
          "price": 215
        },
        {
          "name": "MANGO MOJITO BÜYÜK",
          "price": 225
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 61,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 62,
      "name": "YABAN MERSİNİ MOJITO",
      "description": "Tahmisci specıal",
      "basePrice": 200,
      "priceLabel": "₺200 - ₺225",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "YABAN MERSİNİ MOJITO KÜÇÜK",
          "price": 200
        },
        {
          "name": "YABAN MERSİNİ MOJITO ORTA",
          "price": 215
        },
        {
          "name": "YABAN MERSİNİ MOJITO BÜYÜK",
          "price": 225
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 62,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 63,
      "name": "FRAMBUAZ MOJITO",
      "description": "Tahmisci specıal",
      "basePrice": 200,
      "priceLabel": "₺200 - ₺225",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "FRAMBUAZ MOJITO KÜÇÜK",
          "price": 200
        },
        {
          "name": "FRAMBUAZ MOJITO ORTA",
          "price": 215
        },
        {
          "name": "FRAMBUAZ MOJITO BÜYÜK",
          "price": 225
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 63,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 64,
      "name": "DARK NUT",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ICE DARK NUT KÜÇÜK",
          "price": 225
        },
        {
          "name": "ICE DARK NUT ORTA",
          "price": 240
        },
        {
          "name": "ICE DARK NUT BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 64,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 65,
      "name": "REDBERRY",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "REDBERRY KÜÇÜK",
          "price": 225
        },
        {
          "name": "REDBERRY ORTA",
          "price": 240
        },
        {
          "name": "REDBERRY BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 65,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 66,
      "name": "COZERA",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "COZERA KÜÇÜK",
          "price": 225
        },
        {
          "name": "COZERA ORTA",
          "price": 240
        },
        {
          "name": "COZERA BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 66,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 67,
      "name": "SWEET LIME",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "SWEET LIME KÜÇÜK",
          "price": 225
        },
        {
          "name": "SWEET LIME ORTA",
          "price": 240
        },
        {
          "name": "SWEET LIME BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 67,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 68,
      "name": "OREO COFFE LATTE",
      "description": "Espresso + süt",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "OREO COFFE LATTE  KÜÇÜK",
          "price": 225
        },
        {
          "name": "OREO COFFE LATTE  ORTA",
          "price": 240
        },
        {
          "name": "OREO COFFE LATTE  BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 68,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 69,
      "name": "STRAWBERRY MOCHA",
      "description": "Espresso + çikolata + süt",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "STRAWBERRY MOCHA KÜÇÜK",
          "price": 225
        },
        {
          "name": "STRAWBERRY MOCHA ORTA",
          "price": 240
        },
        {
          "name": "STRAWBERRY MOCHA BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 69,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 70,
      "name": "GOLDEN NUT",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "GOLDEN NUT KÜÇÜK",
          "price": 225
        },
        {
          "name": "GOLDEN NUT ORTA",
          "price": 240
        },
        {
          "name": "GOLDEN NUT BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 70,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 71,
      "name": "DARK NUT",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "DARK NUT KÜÇÜK",
          "price": 225
        },
        {
          "name": "DARK NUT ORTA",
          "price": 240
        },
        {
          "name": "DARK NUT BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 71,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 72,
      "name": "WHITE NUT",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "WHITE NUT KÜÇÜK",
          "price": 225
        },
        {
          "name": "WHITE NUT ORTA",
          "price": 240
        },
        {
          "name": "WHITE NUT BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 72,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 73,
      "name": "HONEY SPICE",
      "description": "Tahmisci specıal",
      "basePrice": 240,
      "priceLabel": "₺240 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "HONEY SPICE KÜÇÜK",
          "price": 240
        },
        {
          "name": "HONEY SPICE ORTA",
          "price": 250
        },
        {
          "name": "HONEY SPICE BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 73,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 74,
      "name": "WHITE FOREST",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "WHITE FOREST KÜÇÜK",
          "price": 225
        },
        {
          "name": "WHITE FOREST ORTA",
          "price": 240
        },
        {
          "name": "WHITE FOREST BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 74,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 75,
      "name": "TROPICAL SALT",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "TROPICAL SALT KÜÇÜK",
          "price": 225
        },
        {
          "name": "TROPICAL SALT ORTA",
          "price": 240
        },
        {
          "name": "TROPICAL SALT BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 75,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 76,
      "name": "EMERALD NUT",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "EMERALD NUT KÜÇÜK",
          "price": 225
        },
        {
          "name": "EMERALD NUT ORTA",
          "price": 240
        },
        {
          "name": "EMERALD NUT BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 76,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 77,
      "name": "TİRAMİSU LATTE",
      "description": "Espresso + süt",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "TİRAMİSU LATTE KÜÇÜK",
          "price": 225
        },
        {
          "name": "TİRAMİSU LATTE ORTA",
          "price": 240
        },
        {
          "name": "TİRAMİSU LATTE BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 77,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 78,
      "name": "BLUSH LATTE",
      "description": "Espresso + süt",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "BLUSH LATTE KÜÇÜK",
          "price": 225
        },
        {
          "name": "BLUSH LATTE ORTA",
          "price": 240
        },
        {
          "name": "BLUSH LATTE BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 78,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 79,
      "name": "WINTER MINT",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "WINTER MINT KÜÇÜK",
          "price": 225
        },
        {
          "name": "WINTER MINT ORTA",
          "price": 240
        },
        {
          "name": "WINTER MINT BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 79,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 80,
      "name": "ORANGE CHOCALATE",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ORANGE CHOCALATE KÜÇÜK",
          "price": 225
        },
        {
          "name": "ORANGE CHOCALATE ORTA",
          "price": 240
        },
        {
          "name": "ORANGE CHOCALATE BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 80,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 81,
      "name": "PARIS KISS",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "PARIS KISS KÜÇÜK",
          "price": 225
        },
        {
          "name": "PARIS KISS ORTA",
          "price": 240
        },
        {
          "name": "PARIS KISS BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 81,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 82,
      "name": "COCO CREAM",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "COCO CREAM KÜÇÜK",
          "price": 225
        },
        {
          "name": "COCO CREAM ORTA",
          "price": 240
        },
        {
          "name": "COCO CREAM BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 82,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 83,
      "name": "WHITE BRULEE",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "WHITE BRULEE KÜÇÜK",
          "price": 225
        },
        {
          "name": "WHITE BRULEE ORTA",
          "price": 240
        },
        {
          "name": "WHITE BRULEE BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 83,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 84,
      "name": "BLACK LATTE",
      "description": "Espresso + süt",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "BLACK LATTE KÜÇÜK",
          "price": 225
        },
        {
          "name": "BLACK LATTE ORTA",
          "price": 250
        },
        {
          "name": "BLACK LATTE BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 84,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 85,
      "name": "OREO COFFE LATTE",
      "description": "Espresso + süt",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺250",
      "oldPrice": null,
      "category": 105,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 1,
      "parentCategoryName": "SOĞUKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "OREO COFFE LATTE KÜÇÜK",
          "price": 225
        },
        {
          "name": "OREO COFFE LATTE ORTA",
          "price": 240
        },
        {
          "name": "OREO COFFE LATTE BÜYÜK",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 85,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 86,
      "name": "Demleme Bitki Çayları",
      "description": "Demleme çay",
      "basePrice": 150,
      "priceLabel": "₺150",
      "oldPrice": null,
      "category": 201,
      "categoryName": "SICAK İÇECEKLER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "Adaçayı",
          "price": 150
        },
        {
          "name": "Ihlamur",
          "price": 150
        },
        {
          "name": "Yeşil Çay",
          "price": 150
        },
        {
          "name": "Beyaz Çay",
          "price": 150
        },
        {
          "name": "Robios (kırmızı Çay)",
          "price": 150
        },
        {
          "name": "Meyveli Kış Çayı",
          "price": 150
        },
        {
          "name": "Gram Masala Chai",
          "price": 150
        },
        {
          "name": "Portakal Çayı",
          "price": 150
        },
        {
          "name": "Kivi Çayı",
          "price": 150
        },
        {
          "name": "Nar Çayı",
          "price": 150
        },
        {
          "name": "Çilek Çayı",
          "price": 150
        },
        {
          "name": "Böğürtlen Çayı",
          "price": 150
        },
        {
          "name": "Nane-Limon Çayı",
          "price": 150
        },
        {
          "name": "Yaseminli Yeşil Çay",
          "price": 150
        },
        {
          "name": "Relax Çay",
          "price": 150
        },
        {
          "name": "Zencefil Tarçın Çayı",
          "price": 150
        },
        {
          "name": "Detok Çayı",
          "price": 150
        },
        {
          "name": "Kuşburnu-Hibiskus",
          "price": 150
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 86,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 87,
      "name": "ÇAY",
      "description": "Demleme çay",
      "basePrice": 50,
      "priceLabel": "₺50",
      "oldPrice": null,
      "category": 201,
      "categoryName": "SICAK İÇECEKLER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 87,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 88,
      "name": "SICAK ÇİKOLATA",
      "description": "Sıcak içecekler",
      "basePrice": 150,
      "priceLabel": "₺150 - ₺165",
      "oldPrice": null,
      "category": 201,
      "categoryName": "SICAK İÇECEKLER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "SICAK ÇİKOLATA KÜÇÜK",
          "price": 150
        },
        {
          "name": "SICAK ÇİKOLATA ORTA",
          "price": 165
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 88,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 89,
      "name": "SICAK BEYAZ ÇİKOLATA",
      "description": "Sıcak içecekler",
      "basePrice": 150,
      "priceLabel": "₺150 - ₺165",
      "oldPrice": null,
      "category": 201,
      "categoryName": "SICAK İÇECEKLER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "SICAK BEYAZ ÇİKOLATA KÜÇÜK",
          "price": 150
        },
        {
          "name": "SICAK BEYAZ ÇİKOLATA ORTA",
          "price": 165
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 89,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 90,
      "name": "SAHLEP",
      "description": "Sıcak içecekler",
      "basePrice": 150,
      "priceLabel": "₺150 - ₺165",
      "oldPrice": null,
      "category": 201,
      "categoryName": "SICAK İÇECEKLER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "SAHLEP KÜÇÜK",
          "price": 150
        },
        {
          "name": "SAHLEP ORTA",
          "price": 165
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 90,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 91,
      "name": "CHAI TEA",
      "description": "Sıcak içecekler",
      "basePrice": 165,
      "priceLabel": "₺165 - ₺180",
      "oldPrice": null,
      "category": 201,
      "categoryName": "SICAK İÇECEKLER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "CHAI TEA  KÜÇÜK",
          "price": 165
        },
        {
          "name": "CHAI TEA  ORTA",
          "price": 180
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 91,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 92,
      "name": "LATTE",
      "description": "Espresso + süt",
      "basePrice": 160,
      "priceLabel": "₺160 - ₺175",
      "oldPrice": null,
      "category": 202,
      "categoryName": "SICAK KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "LATTE KÜÇÜK",
          "price": 160
        },
        {
          "name": "LATTE ORTA",
          "price": 175
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 92,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 93,
      "name": "FLAT WHITE",
      "description": "Çift espresso + süt",
      "basePrice": 175,
      "priceLabel": "₺175 - ₺190",
      "oldPrice": null,
      "category": 202,
      "categoryName": "SICAK KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "FLAT WHITE KÜÇÜK",
          "price": 175
        },
        {
          "name": "FLAT WHITE ORTA",
          "price": 190
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 93,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 94,
      "name": "CAPPUCINO",
      "description": "Espresso + süt köpüğü",
      "basePrice": 160,
      "priceLabel": "₺160 - ₺175",
      "oldPrice": null,
      "category": 202,
      "categoryName": "SICAK KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "CAPPUCINO KÜÇÜK",
          "price": 160
        },
        {
          "name": "CAPPUCINO ORTA",
          "price": 175
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 94,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 95,
      "name": "CORTADO",
      "description": "Sıcak kahveler",
      "basePrice": 150,
      "priceLabel": "₺150",
      "oldPrice": null,
      "category": 202,
      "categoryName": "SICAK KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 95,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 96,
      "name": "FİLTRE KAHVE",
      "description": "Filtre kahve",
      "basePrice": 130,
      "priceLabel": "₺130 - ₺145",
      "oldPrice": null,
      "category": 202,
      "categoryName": "SICAK KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "FİLTRE KAHVE KÜÇÜK",
          "price": 130
        },
        {
          "name": "FİLTRE KAHVE ORTA",
          "price": 145
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 96,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 97,
      "name": "AMERICANO",
      "description": "Espresso + su",
      "basePrice": 150,
      "priceLabel": "₺150 - ₺165",
      "oldPrice": null,
      "category": 202,
      "categoryName": "SICAK KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "AMERICANO KÜÇÜK",
          "price": 150
        },
        {
          "name": "AMERICANO ORTA",
          "price": 165
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 97,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 98,
      "name": "ESPRESSO MACHIATO",
      "description": "Yoğun espresso",
      "basePrice": 140,
      "priceLabel": "₺140 - ₺160",
      "oldPrice": null,
      "category": 202,
      "categoryName": "SICAK KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "SINGLE ESPRESSO MACHIATO",
          "price": 140
        },
        {
          "name": "DOUBLE ESPRESSO MACHIATO",
          "price": 160
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 98,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 99,
      "name": "ESPRESSO PANNA",
      "description": "Yoğun espresso",
      "basePrice": 140,
      "priceLabel": "₺140 - ₺160",
      "oldPrice": null,
      "category": 202,
      "categoryName": "SICAK KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "SINGLE ESPRESSO PANNA",
          "price": 140
        },
        {
          "name": "DOUBLE ESPRESSO PANNA",
          "price": 160
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 99,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 100,
      "name": "ESPRESSO",
      "description": "Yoğun espresso",
      "basePrice": 130,
      "priceLabel": "₺130 - ₺150",
      "oldPrice": null,
      "category": 202,
      "categoryName": "SICAK KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "SINGLE ESPRESSO",
          "price": 130
        },
        {
          "name": "DOUBLE ESPRESSO",
          "price": 150
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 100,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 101,
      "name": "V60 Demleme",
      "description": "Sıcak kahveler",
      "basePrice": 260,
      "priceLabel": "₺260",
      "oldPrice": null,
      "category": 202,
      "categoryName": "SICAK KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 101,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 102,
      "name": "Chemax Demleme",
      "description": "Sıcak kahveler",
      "basePrice": 260,
      "priceLabel": "₺260",
      "oldPrice": null,
      "category": 202,
      "categoryName": "SICAK KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 102,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 103,
      "name": "REDEYE",
      "description": "Sıcak kahveler",
      "basePrice": 160,
      "priceLabel": "₺160 - ₺175",
      "oldPrice": null,
      "category": 202,
      "categoryName": "SICAK KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "REDEYE KÜÇÜK",
          "price": 160
        },
        {
          "name": "REDEYE ORTA",
          "price": 175
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 103,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 104,
      "name": "BLACKEYE",
      "description": "Sıcak kahveler",
      "basePrice": 170,
      "priceLabel": "₺170 - ₺185",
      "oldPrice": null,
      "category": 202,
      "categoryName": "SICAK KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "BLACKEYE KÜÇÜK",
          "price": 170
        },
        {
          "name": "BLACKEYE ORTA",
          "price": 185
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 104,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 105,
      "name": "Toffee Nut Latte",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "Toffee Nut Latte KÜÇÜK",
          "price": 185
        },
        {
          "name": "TOFFENUT LATTE ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 105,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 106,
      "name": "VANİLYA LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "VANİLYA LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "VANİLYA LATTE ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 106,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 107,
      "name": "Cookie Latte",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "Cookie Latte KÜÇÜK",
          "price": 185
        },
        {
          "name": "Cookie Latte ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 107,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 108,
      "name": "LOTUS LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "LOTUS LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "LOTUS LATTE ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 108,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 109,
      "name": "BADEM LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "BADEM LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "BADEM LATTE ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 109,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 110,
      "name": "IRISH LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "IRISH LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "IRISH LATTE ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 110,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 111,
      "name": "COCONUT LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "COCONUT LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "COCONUT LATTE ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 111,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 112,
      "name": "PUMPKIN SPICE LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "PUMPKIN SPICE LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "PUMPKIN SPICE LATTE ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 112,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 113,
      "name": "CARAMEL LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "CARAMEL LATTE ORTA",
          "price": 200
        },
        {
          "name": "CARAMEL LATTE KÜÇÜK",
          "price": 185
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 113,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 114,
      "name": "ANTEP LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ANTEP LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "ANTEP LATTE ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 114,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 115,
      "name": "caramel macchiato",
      "description": "Sıcak aromalı kahveler",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "Caramel Macchiato KÜÇÜK",
          "price": 185
        },
        {
          "name": "Caramel Macchiato ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 115,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 116,
      "name": "MOCHA KÜÇÜK",
      "description": "Espresso + çikolata + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "MOCHA KÜÇÜK",
          "price": 185
        },
        {
          "name": "MOCHA ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 116,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 117,
      "name": "WHITE MOCHA",
      "description": "Espresso + çikolata + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "WHITE MOCHA KÜÇÜK",
          "price": 185
        },
        {
          "name": "WHITE MOCHA ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 117,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 118,
      "name": "CARAMEL MOCHA",
      "description": "Espresso + çikolata + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "CARAMEL MOCHA KÜÇÜK",
          "price": 185
        },
        {
          "name": "CARAMEL MOCHA ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 118,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 119,
      "name": "SALTED CARAMEL",
      "description": "Sıcak aromalı kahveler",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "SALTED CARAMEL KÜÇÜK",
          "price": 185
        },
        {
          "name": "SALTED CARAMEL ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 119,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 120,
      "name": "TİRAMİSU LATTE",
      "description": "Espresso + süt",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "TİRAMİSU LATTE KÜÇÜK",
          "price": 225
        },
        {
          "name": "TİRAMİSU LATTE ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 120,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 121,
      "name": "FINDIK LATTE",
      "description": "Espresso + süt",
      "basePrice": 185,
      "priceLabel": "₺185 - ₺200",
      "oldPrice": null,
      "category": 203,
      "categoryName": "SICAK AROMALI KAHVELER",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "FINDIK LATTE KÜÇÜK",
          "price": 185
        },
        {
          "name": "FINDIK LATTE ORTA",
          "price": 200
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 121,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 122,
      "name": "GOLDEN NUT",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "GOLDEN NUT KÜÇÜK",
          "price": 225
        },
        {
          "name": "GOLDEN NUT ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 122,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 123,
      "name": "DARK NUT",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "DARK NUT KÜÇÜK",
          "price": 225
        },
        {
          "name": "DARK NUT ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 123,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 124,
      "name": "WHITE NUTT",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "WHITE NUT KÜÇÜK",
          "price": 225
        },
        {
          "name": "WHITE NUT ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 124,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 125,
      "name": "HONEY SPICE",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "HONEY SPICE KÜÇÜK",
          "price": 225
        },
        {
          "name": "HONEY SPICE ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 125,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 126,
      "name": "WHITE FOREST",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "WHITE FOREST KÜÇÜK",
          "price": 225
        },
        {
          "name": "WHITE FOREST ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 126,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 127,
      "name": "TROPICAL SALT",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "TROPICAL SALT KÜÇÜK",
          "price": 225
        },
        {
          "name": "TROPICAL SALT ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 127,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 128,
      "name": "EMERALD NUTT",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "EMERALD NUT KÜÇÜK",
          "price": 225
        },
        {
          "name": "EMERALD NUT ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 128,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 129,
      "name": "TİRAMİSU LATTE",
      "description": "Espresso + süt",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "TİRAMİSU LATTE KÜÇÜK",
          "price": 225
        },
        {
          "name": "TİRAMİSU LATTE ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 129,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 130,
      "name": "BLUSH LATTE",
      "description": "Espresso + süt",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "BLUSH LATTE KÜÇÜK",
          "price": 225
        },
        {
          "name": "BLUSH LATTE ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 130,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 131,
      "name": "WINTER MINT",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "WINTER MINT KÜÇÜK",
          "price": 225
        },
        {
          "name": "WINTER MINT ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 131,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 132,
      "name": "ORANGE CHOCALATE",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ORANGE CHOCALATE KÜÇÜK",
          "price": 225
        },
        {
          "name": "ORANGE CHOCALATE ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 132,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 133,
      "name": "PARİS KISS",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "PARİS KISS  KÜÇÜK",
          "price": 225
        },
        {
          "name": "PARİS KISS  ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 133,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 134,
      "name": "COCO CREAM",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "COCO CREAM KÜÇÜK",
          "price": 225
        },
        {
          "name": "COCO CREAM  ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 134,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 135,
      "name": "White Brulee",
      "description": "Tahmisci specıal",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "White Brulee KÜÇÜK",
          "price": 225
        },
        {
          "name": "White Brulee ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 135,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 136,
      "name": "BLACK LATTE",
      "description": "Espresso + süt",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "BLACK LATTE KÜÇÜK",
          "price": 225
        },
        {
          "name": "BLACK LATTE ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 136,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 137,
      "name": "OREO COFFE LATTE",
      "description": "Espresso + süt",
      "basePrice": 225,
      "priceLabel": "₺225 - ₺240",
      "oldPrice": null,
      "category": 204,
      "categoryName": "TAHMİSCİ SPECIAL",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "OREO COFFE LATTE  KÜÇÜK",
          "price": 225
        },
        {
          "name": "OREO COFFE LATTE  ORTA",
          "price": 240
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 137,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 138,
      "name": "MATCHA LATTE",
      "description": "Matcha + süt",
      "basePrice": 200,
      "priceLabel": "₺200 - ₺220",
      "oldPrice": null,
      "category": 205,
      "categoryName": "MATCHA LATTE",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "MATCHA LATTE KÜÇÜK",
          "price": 200
        },
        {
          "name": "MATCHA LATTE ORTA",
          "price": 220
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 138,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 139,
      "name": "ÇİLEKLE MATCHA LATTE",
      "description": "Matcha + süt",
      "basePrice": 230,
      "priceLabel": "₺230 - ₺250",
      "oldPrice": null,
      "category": 205,
      "categoryName": "MATCHA LATTE",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ÇİLEKLİ MATCHA LATTE KÜÇÜK",
          "price": 230
        },
        {
          "name": "ÇİLEKLİ MATCHA LATTE ORTA",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 139,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 140,
      "name": "MANGO MATCHA LATTE",
      "description": "Matcha + süt",
      "basePrice": 230,
      "priceLabel": "₺230 - ₺250",
      "oldPrice": null,
      "category": 205,
      "categoryName": "MATCHA LATTE",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "MANGO MATCHA LATTE KÜÇÜK",
          "price": 230
        },
        {
          "name": "MANGO MATCHA LATTE ORTA",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 140,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 141,
      "name": "VANİLYA MATCHA LATTE",
      "description": "Matcha + süt",
      "basePrice": 230,
      "priceLabel": "₺230 - ₺250",
      "oldPrice": null,
      "category": 205,
      "categoryName": "MATCHA LATTE",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "VANİLYA MATCHA LATTE KÜÇÜK",
          "price": 230
        },
        {
          "name": "VANİLYA MATCHA LATTE ORTA",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 141,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 142,
      "name": "FRAMBUAZ MATCHA LATTE",
      "description": "Matcha + süt",
      "basePrice": 230,
      "priceLabel": "₺230 - ₺250",
      "oldPrice": null,
      "category": 205,
      "categoryName": "MATCHA LATTE",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "FRAMBUAZ MATCHA KÜÇÜK",
          "price": 230
        },
        {
          "name": "FRAMBUAZ MATCHA LATTE ORTA",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 142,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 143,
      "name": "PASSION FRUIT MATCHA LATTE",
      "description": "Matcha + süt",
      "basePrice": 230,
      "priceLabel": "₺230 - ₺250",
      "oldPrice": null,
      "category": 205,
      "categoryName": "MATCHA LATTE",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "PASSION FRUIT MATCHA LATTE KÜÇÜK",
          "price": 230
        },
        {
          "name": "PASSION FRUIT MATCHA LATTE ORTA",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 143,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 144,
      "name": "NARLI MATCHA LATTE",
      "description": "Matcha + süt",
      "basePrice": 230,
      "priceLabel": "₺230 - ₺250",
      "oldPrice": null,
      "category": 205,
      "categoryName": "MATCHA LATTE",
      "parentCategory": 2,
      "parentCategoryName": "SICAKLAR",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "NARLI MATCHA LATTE KÜÇÜK",
          "price": 230
        },
        {
          "name": "NARLI MATCHA LATTE ORTA",
          "price": 250
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 144,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 145,
      "name": "TÜRK KAHVESİ",
      "description": "Geleneksel Türk kahvesi",
      "basePrice": 100,
      "priceLabel": "₺100",
      "oldPrice": null,
      "category": 301,
      "categoryName": "TÜRK KAHVELERİ",
      "parentCategory": 3,
      "parentCategoryName": "TÜRK KAHVELERİ",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 145,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 146,
      "name": "DAMLA SAKIZLI",
      "description": "Türk kahveleri",
      "basePrice": 130,
      "priceLabel": "₺130",
      "oldPrice": null,
      "category": 301,
      "categoryName": "TÜRK KAHVELERİ",
      "parentCategory": 3,
      "parentCategoryName": "TÜRK KAHVELERİ",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 146,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 147,
      "name": "DİBEK",
      "description": "Türk kahveleri",
      "basePrice": 130,
      "priceLabel": "₺130",
      "oldPrice": null,
      "category": 301,
      "categoryName": "TÜRK KAHVELERİ",
      "parentCategory": 3,
      "parentCategoryName": "TÜRK KAHVELERİ",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 147,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 148,
      "name": "MENENGİÇ",
      "description": "Türk kahveleri",
      "basePrice": 130,
      "priceLabel": "₺130",
      "oldPrice": null,
      "category": 301,
      "categoryName": "TÜRK KAHVELERİ",
      "parentCategory": 3,
      "parentCategoryName": "TÜRK KAHVELERİ",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 148,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 149,
      "name": "KOYU TÜRK KAHVESİ",
      "description": "Geleneksel Türk kahvesi",
      "basePrice": 100,
      "priceLabel": "₺100",
      "oldPrice": null,
      "category": 301,
      "categoryName": "TÜRK KAHVELERİ",
      "parentCategory": 3,
      "parentCategoryName": "TÜRK KAHVELERİ",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 149,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 150,
      "name": "PANINI DANA JAMBON",
      "description": "Sandviçler",
      "basePrice": 200,
      "priceLabel": "₺200",
      "oldPrice": null,
      "category": 401,
      "categoryName": "SANDVİÇLER",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 150,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 151,
      "name": "3 PEYNİRLİ BAGEL",
      "description": "Sandviçler",
      "basePrice": 150,
      "priceLabel": "₺150",
      "oldPrice": null,
      "category": 401,
      "categoryName": "SANDVİÇLER",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 151,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 152,
      "name": "MIAMI ROASTBEEF BAGEL",
      "description": "Sandviçler",
      "basePrice": 200,
      "priceLabel": "₺200",
      "oldPrice": null,
      "category": 401,
      "categoryName": "SANDVİÇLER",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 152,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 153,
      "name": "KARE MOZZARELLA",
      "description": "Sandviçler",
      "basePrice": 150,
      "priceLabel": "₺150",
      "oldPrice": null,
      "category": 401,
      "categoryName": "SANDVİÇLER",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 153,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 154,
      "name": "MONTE CRISTO",
      "description": "Sandviçler",
      "basePrice": 170,
      "priceLabel": "₺170",
      "oldPrice": null,
      "category": 401,
      "categoryName": "SANDVİÇLER",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 154,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 155,
      "name": "Artizan Suda Mozeralla",
      "description": "Sandviçler",
      "basePrice": 220,
      "priceLabel": "₺220",
      "oldPrice": null,
      "category": 401,
      "categoryName": "SANDVİÇLER",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 155,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 156,
      "name": "Artizan Izgara Tavuk",
      "description": "Sandviçler",
      "basePrice": 220,
      "priceLabel": "₺220",
      "oldPrice": null,
      "category": 401,
      "categoryName": "SANDVİÇLER",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 156,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 157,
      "name": "Artizan Dana Jambon Cheddar",
      "description": "Sandviçler",
      "basePrice": 220,
      "priceLabel": "₺220",
      "oldPrice": null,
      "category": 401,
      "categoryName": "SANDVİÇLER",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 157,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 158,
      "name": "Dört Peynirli Foccacia",
      "description": "Sandviçler",
      "basePrice": 180,
      "priceLabel": "₺180",
      "oldPrice": null,
      "category": 401,
      "categoryName": "SANDVİÇLER",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 158,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 159,
      "name": "Limonlu Cheesecake",
      "description": "Günlük tatlı seçeneği",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 159,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 160,
      "name": "Frambuazlı Cheesecake",
      "description": "Günlük tatlı seçeneği",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 160,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 161,
      "name": "San Sebastian Cheesecake",
      "description": "Günlük tatlı seçeneği",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 161,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 162,
      "name": "Antep Fıstıklı San Sebastian",
      "description": "Tatlılar",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 162,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 163,
      "name": "Belçika Çikolatalı Pasta",
      "description": "Günlük tatlı seçeneği",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 163,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 164,
      "name": "Havuçlu Kremalı Pasta",
      "description": "Günlük tatlı seçeneği",
      "basePrice": 200,
      "priceLabel": "₺200",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 164,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 165,
      "name": "Antep Cedric",
      "description": "Tatlılar",
      "basePrice": 280,
      "priceLabel": "₺280",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 165,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 166,
      "name": "Coconut Pasta",
      "description": "Günlük tatlı seçeneği",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 166,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 167,
      "name": "Kahve Çekirdeği Pasta",
      "description": "Günlük tatlı seçeneği",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 167,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 168,
      "name": "White Cascada Mono Pasta",
      "description": "Günlük tatlı seçeneği",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 168,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 169,
      "name": "Tiramisu",
      "description": "Tatlılar",
      "basePrice": 220,
      "priceLabel": "₺220",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 169,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 170,
      "name": "Mozaik Pasta",
      "description": "Günlük tatlı seçeneği",
      "basePrice": 200,
      "priceLabel": "₺200",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 170,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 171,
      "name": "American Brownie Beyaz Çikolata",
      "description": "Tatlılar",
      "basePrice": 260,
      "priceLabel": "₺260",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 171,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 172,
      "name": "Mermer Kek",
      "description": "Günlük tatlı seçeneği",
      "basePrice": 130,
      "priceLabel": "₺130",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 172,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 173,
      "name": "Kakaolu Kek",
      "description": "Günlük tatlı seçeneği",
      "basePrice": 130,
      "priceLabel": "₺130",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 173,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 174,
      "name": "Cookie",
      "description": "Tatlılar",
      "basePrice": 120,
      "priceLabel": "₺120",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 174,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 175,
      "name": "Oreolu Cookie",
      "description": "Tatlılar",
      "basePrice": 120,
      "priceLabel": "₺120",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 175,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 176,
      "name": "Gurme Kruvasan",
      "description": "Tatlılar",
      "basePrice": 150,
      "priceLabel": "₺150",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 176,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 177,
      "name": "Lotuslu Kruvasan",
      "description": "Tatlılar",
      "basePrice": 200,
      "priceLabel": "₺200",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 177,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 178,
      "name": "Nutella-çilek-muz kruvasan",
      "description": "Tatlılar",
      "basePrice": 230,
      "priceLabel": "₺230",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 178,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 179,
      "name": "Fıstık Dünyası",
      "description": "Tatlılar",
      "basePrice": 230,
      "priceLabel": "₺230",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 179,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 180,
      "name": "Klasik Marlenka (bal-ceviz)",
      "description": "Tatlılar",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 180,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 181,
      "name": "Çikolatalı Marlenka",
      "description": "Tatlılar",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 181,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 182,
      "name": "Red Velvet",
      "description": "Tatlılar",
      "basePrice": 230,
      "priceLabel": "₺230",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 182,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 183,
      "name": "Mono Latte",
      "description": "Espresso + süt",
      "basePrice": 230,
      "priceLabel": "₺230",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 183,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 184,
      "name": "Çikolatalı Muffin",
      "description": "Tatlılar",
      "basePrice": 180,
      "priceLabel": "₺180",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 184,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 185,
      "name": "Yaban Mersinli Muffin",
      "description": "Tatlılar",
      "basePrice": 180,
      "priceLabel": "₺180",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 185,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 186,
      "name": "Çikolata Dome",
      "description": "Tatlılar",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 186,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 187,
      "name": "Kalpli Pasta",
      "description": "Günlük tatlı seçeneği",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 187,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 188,
      "name": "Yaban Mersinli Cheesecake",
      "description": "Günlük tatlı seçeneği",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 188,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 189,
      "name": "Çilek Rüyası",
      "description": "Tatlılar",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 189,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 190,
      "name": "Cocostar",
      "description": "Tatlılar",
      "basePrice": 250,
      "priceLabel": "₺250",
      "oldPrice": null,
      "category": 402,
      "categoryName": "TATLILAR",
      "parentCategory": 4,
      "parentCategoryName": "TATLI & SANDWICH",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 190,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 191,
      "name": "ULUDAĞ",
      "description": "Meşrubat",
      "basePrice": 25,
      "priceLabel": "₺25 - ₺85",
      "oldPrice": null,
      "category": 501,
      "categoryName": "MEŞRUBAT",
      "parentCategory": 5,
      "parentCategoryName": "MEŞRUBAT",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "ULUDAĞ SU",
          "price": 25
        },
        {
          "name": "ULUDAĞ SODA",
          "price": 85
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 191,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 192,
      "name": "BEYOĞLU",
      "description": "Meşrubat",
      "basePrice": 80,
      "priceLabel": "₺80 - ₺90",
      "oldPrice": null,
      "category": 501,
      "categoryName": "MEŞRUBAT",
      "parentCategory": 5,
      "parentCategoryName": "MEŞRUBAT",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "BEYOĞLU REYHAN",
          "price": 90
        },
        {
          "name": "BEYOĞLU TURUNCU",
          "price": 90
        },
        {
          "name": "BEYOĞLU ZENCEFİL",
          "price": 90
        },
        {
          "name": "BEYOĞLU CLASSIC",
          "price": 80
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 192,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 193,
      "name": "REDBUL",
      "description": "Meşrubat",
      "basePrice": 150,
      "priceLabel": "₺150",
      "oldPrice": null,
      "category": 501,
      "categoryName": "MEŞRUBAT",
      "parentCategory": 5,
      "parentCategoryName": "MEŞRUBAT",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [
        {
          "name": "REDBUL ORIGINAL",
          "price": 150
        },
        {
          "name": "REDBULL ŞEKERSİZ",
          "price": 150
        },
        {
          "name": "REDBULL YELLOW",
          "price": 150
        },
        {
          "name": "REDBULL PEACH",
          "price": 150
        },
        {
          "name": "REDBULL WHITE",
          "price": 150
        },
        {
          "name": "REDBULL RED",
          "price": 150
        },
        {
          "name": "REDBULL BLUE",
          "price": 150
        }
      ],
      "product_qr_status": "1",
      "products_branches_id": 193,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 194,
      "name": "ZÜBER",
      "description": "Kasa önü",
      "basePrice": 100,
      "priceLabel": "₺100",
      "oldPrice": null,
      "category": 601,
      "categoryName": "KASA ÖNÜ",
      "parentCategory": 6,
      "parentCategoryName": "KASA ÖNÜ",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 194,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 195,
      "name": "WASA SANDWICH",
      "description": "Günlük hazırlanan sandviç",
      "basePrice": 100,
      "priceLabel": "₺100",
      "oldPrice": null,
      "category": 601,
      "categoryName": "KASA ÖNÜ",
      "parentCategory": 6,
      "parentCategoryName": "KASA ÖNÜ",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 195,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 196,
      "name": "BOUNTY",
      "description": "Kasa önü",
      "basePrice": 100,
      "priceLabel": "₺100",
      "oldPrice": null,
      "category": 601,
      "categoryName": "KASA ÖNÜ",
      "parentCategory": 6,
      "parentCategoryName": "KASA ÖNÜ",
      "image": "assets/images/products/product-8.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-8.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 196,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 197,
      "name": "ALBENİ",
      "description": "Kasa önü",
      "basePrice": 80,
      "priceLabel": "₺80",
      "oldPrice": null,
      "category": 601,
      "categoryName": "KASA ÖNÜ",
      "parentCategory": 6,
      "parentCategoryName": "KASA ÖNÜ",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 197,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 198,
      "name": "M&M'S",
      "description": "Kasa önü",
      "basePrice": 100,
      "priceLabel": "₺100",
      "oldPrice": null,
      "category": 601,
      "categoryName": "KASA ÖNÜ",
      "parentCategory": 6,
      "parentCategoryName": "KASA ÖNÜ",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 198,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 199,
      "name": "MELLY VEGAN",
      "description": "Kasa önü",
      "basePrice": 180,
      "priceLabel": "₺180",
      "oldPrice": null,
      "category": 601,
      "categoryName": "KASA ÖNÜ",
      "parentCategory": 6,
      "parentCategoryName": "KASA ÖNÜ",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 199,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 200,
      "name": "POOLS MEYVE",
      "description": "Kasa önü",
      "basePrice": 190,
      "priceLabel": "₺190",
      "oldPrice": null,
      "category": 601,
      "categoryName": "KASA ÖNÜ",
      "parentCategory": 6,
      "parentCategoryName": "KASA ÖNÜ",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 200,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 201,
      "name": "MAKARON 6'LI",
      "description": "Kasa önü",
      "basePrice": 180,
      "priceLabel": "₺180",
      "oldPrice": null,
      "category": 601,
      "categoryName": "KASA ÖNÜ",
      "parentCategory": 6,
      "parentCategoryName": "KASA ÖNÜ",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 201,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 202,
      "name": "BACKHOUSE BADEMLİ",
      "description": "Kasa önü",
      "basePrice": 200,
      "priceLabel": "₺200",
      "oldPrice": null,
      "category": 601,
      "categoryName": "KASA ÖNÜ",
      "parentCategory": 6,
      "parentCategoryName": "KASA ÖNÜ",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 202,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 203,
      "name": "BACKHOUSE HAŞHAŞLI",
      "description": "Kasa önü",
      "basePrice": 200,
      "priceLabel": "₺200",
      "oldPrice": null,
      "category": 601,
      "categoryName": "KASA ÖNÜ",
      "parentCategory": 6,
      "parentCategoryName": "KASA ÖNÜ",
      "image": "assets/images/products/product-5.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-5.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 203,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 204,
      "name": "BACKHOUSE ACIBADEM",
      "description": "Kasa önü",
      "basePrice": 130,
      "priceLabel": "₺130",
      "oldPrice": null,
      "category": 601,
      "categoryName": "KASA ÖNÜ",
      "parentCategory": 6,
      "parentCategoryName": "KASA ÖNÜ",
      "image": "assets/images/products/product-6.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-6.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 204,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 205,
      "name": "züber protein",
      "description": "Kasa önü",
      "basePrice": 150,
      "priceLabel": "₺150",
      "oldPrice": null,
      "category": 601,
      "categoryName": "KASA ÖNÜ",
      "parentCategory": 6,
      "parentCategoryName": "KASA ÖNÜ",
      "image": "assets/images/products/product-7.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-7.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 205,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 206,
      "name": "Orta Türk Kahvesi",
      "description": "Geleneksel Türk kahvesi",
      "basePrice": 1200,
      "priceLabel": "₺1200",
      "oldPrice": null,
      "category": 701,
      "categoryName": "TÜRK KAHVELERİ",
      "parentCategory": 7,
      "parentCategoryName": "PAKETLİ ÜRÜN",
      "image": "assets/images/products/product-9.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-9.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 206,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 207,
      "name": "Koyu Türk Kahvesi",
      "description": "Geleneksel Türk kahvesi",
      "basePrice": 1200,
      "priceLabel": "₺1200",
      "oldPrice": null,
      "category": 701,
      "categoryName": "TÜRK KAHVELERİ",
      "parentCategory": 7,
      "parentCategoryName": "PAKETLİ ÜRÜN",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 207,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 208,
      "name": "Damla sakızlı Türk Kahvesi",
      "description": "Geleneksel Türk kahvesi",
      "basePrice": 1500,
      "priceLabel": "₺1500",
      "oldPrice": null,
      "category": 701,
      "categoryName": "TÜRK KAHVELERİ",
      "parentCategory": 7,
      "parentCategoryName": "PAKETLİ ÜRÜN",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 208,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 209,
      "name": "Dibek kahvesi",
      "description": "Türk kahveleri",
      "basePrice": 1500,
      "priceLabel": "₺1500",
      "oldPrice": null,
      "category": 701,
      "categoryName": "TÜRK KAHVELERİ",
      "parentCategory": 7,
      "parentCategoryName": "PAKETLİ ÜRÜN",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 209,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 210,
      "name": "Menengiç kahvesi",
      "description": "Türk kahveleri",
      "basePrice": 1500,
      "priceLabel": "₺1500",
      "oldPrice": null,
      "category": 701,
      "categoryName": "TÜRK KAHVELERİ",
      "parentCategory": 7,
      "parentCategoryName": "PAKETLİ ÜRÜN",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 210,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 211,
      "name": "Kolombiya san rosada",
      "description": "Kahve çekirdekleri",
      "basePrice": 2250,
      "priceLabel": "₺2250",
      "oldPrice": null,
      "category": 702,
      "categoryName": "KAHVE ÇEKİRDEKLERİ",
      "parentCategory": 7,
      "parentCategoryName": "PAKETLİ ÜRÜN",
      "image": "assets/images/products/product-10.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-10.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 211,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 212,
      "name": "Guatemala la pilala",
      "description": "Kahve çekirdekleri",
      "basePrice": 3000,
      "priceLabel": "₺3000",
      "oldPrice": null,
      "category": 702,
      "categoryName": "KAHVE ÇEKİRDEKLERİ",
      "parentCategory": 7,
      "parentCategoryName": "PAKETLİ ÜRÜN",
      "image": "assets/images/products/product-1.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-1.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 212,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 213,
      "name": "Endonezya frinsa",
      "description": "Kahve çekirdekleri",
      "basePrice": 3250,
      "priceLabel": "₺3250",
      "oldPrice": null,
      "category": 702,
      "categoryName": "KAHVE ÇEKİRDEKLERİ",
      "parentCategory": 7,
      "parentCategoryName": "PAKETLİ ÜRÜN",
      "image": "assets/images/products/product-2.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-2.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 213,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 214,
      "name": "Tahmisci espresso",
      "description": "Yoğun espresso",
      "basePrice": 1800,
      "priceLabel": "₺1800",
      "oldPrice": null,
      "category": 702,
      "categoryName": "KAHVE ÇEKİRDEKLERİ",
      "parentCategory": 7,
      "parentCategoryName": "PAKETLİ ÜRÜN",
      "image": "assets/images/products/product-3.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-3.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 214,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    },
    {
      "id": 215,
      "name": "Filtre kahve çekirdeği",
      "description": "Filtre kahve",
      "basePrice": 1800,
      "priceLabel": "₺1800",
      "oldPrice": null,
      "category": 702,
      "categoryName": "KAHVE ÇEKİRDEKLERİ",
      "parentCategory": 7,
      "parentCategoryName": "PAKETLİ ÜRÜN",
      "image": "assets/images/products/product-4.jpg",
      "image_source": "tahmisci_brand",
      "media": [
        {
          "type": "image",
          "url": "assets/images/products/product-4.jpg"
        }
      ],
      "badge": null,
      "popular": 0,
      "variants": [],
      "product_qr_status": "1",
      "products_branches_id": 215,
      "products_branches_company_id": 1,
      "products_branches_calories": "",
      "products_branches_calories_unit": ""
    }
  ]
};
  const heroMedia = {
    primary: "assets/images/hero/tahmisci-barista-main.jpg",
    detail: "assets/images/hero/tahmisci-barista-detail.jpg",
    reel: "assets/videos/tahmisci-social-reel.mp4",
    poster: "assets/images/hero/tahmisci-barista-detail.jpg"
  };
  const hero = { media: heroMedia, slides: [
    { title: "Kahvenin iyi hali", description: "Özenle hazırlanan kahveler ve günün her anına eşlik eden lezzetler.", buttonText: "Menüyü Keşfet", buttonIcon: "fas fa-mug-hot", buttonUrl: "#menu", backgroundImage: heroMedia.detail }
  ], autoplay: false, autoplayInterval: 5500, transitionSpeed: 600 };
  window.TahmisciCatalog = catalog;
  window.MenuCategories = [];
  window.MenuProducts = [];
  window.SITE_TITLE_BRAND = "Tahmisçi";
  if (typeof APP_CONFIG !== "undefined") {
    APP_CONFIG.name = "Tahmisçi";
    APP_CONFIG.description = "Tahmisçi dijital menü";
    APP_CONFIG.author = "Tahmisçi";
    APP_CONFIG.hero = hero;
    APP_CONFIG.demo.products.items = catalog.products.filter((product) => product.popular).slice(0, 8);
    APP_CONFIG.company = { name: "Tahmisçi" };
    APP_CONFIG.seo.keywords = "Tahmisçi, kahve, dijital menü";
  }
  const originalFetch = typeof window.fetch === "function" ? window.fetch.bind(window) : null;
  const respond = (payload) => Promise.resolve(new Response(JSON.stringify(payload), { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }));
  const normalizeText = (value) => String(value || "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const recipeCache = { source: null, entries: [] };
  const normalizeRecipeItem = (value) => {
    if (typeof value === "string") return { content: value.trim(), preparation: "" };
    if (value && typeof value === "object") {
      return {
        content: String(value.content || value.recipe || value.ingredients || "").trim(),
        preparation: String(value.preparation || value.steps || "").trim()
      };
    }
    return { content: "", preparation: "" };
  };
  const recipeEntries = () => {
    const source = window.DEFAULT_RECIPE_DATA;
    if (!source || typeof source !== "object") return [];
    if (recipeCache.source === source) return recipeCache.entries;
    const entries = [];
    Object.keys(source).forEach((category) => {
      const products = source[category] || {};
      Object.keys(products).forEach((productName) => {
        const sizes = products[productName] || {};
        const sizeNames = Object.keys(sizes);
        const preferredSize = sizeNames.includes("Standart")
          ? "Standart"
          : (sizeNames.includes("16 oz") ? "16 oz" : sizeNames[0]);
        const recipe = normalizeRecipeItem(sizes[preferredSize]);
        if (!recipe.content) return;
        entries.push({
          key: normalizeText(productName),
          name: productName,
          category,
          size: preferredSize || "",
          content: recipe.content
        });
      });
    });
    recipeCache.source = source;
    recipeCache.entries = entries.sort((a, b) => b.key.length - a.key.length);
    return recipeCache.entries;
  };
  const findRecipeForProduct = (product) => {
    const productKey = normalizeText(product && product.name);
    if (!productKey) return null;
    const entries = recipeEntries();
    return entries.find((entry) => entry.key === productKey) ||
      entries.find((entry) => entry.key.length > 3 && (productKey.includes(entry.key) || entry.key.includes(productKey))) ||
      null;
  };
  const inferAllergens = (text) => {
    const key = normalizeText(text);
    const rules = [
      { label: "Süt", words: ["sut", "latte", "cappuccino", "flat white", "krema", "krem"] },
      { label: "Gluten", words: ["sandvic", "sandwich", "ekmek", "kruvasan", "cookie", "brownie", "cheesecake", "pasta"] },
      { label: "Kuruyemiş", words: ["badem", "findik", "fistik", "antep"] },
      { label: "Çikolata/kakao", words: ["cikolata", "kakao"] },
      { label: "Yumurta", words: ["yumurta"] },
      { label: "Soya", words: ["soya"] }
    ];
    return rules
      .filter((rule) => rule.words.some((word) => key.includes(word)))
      .map((rule) => rule.label);
  };
  const categoryNameEn = {
    all: "All",
    1: "COLD DRINKS",
    101: "COLD BEVERAGES",
    102: "ICED COFFEES",
    103: "FLAVORED ICED COFFEES",
    104: "MATCHA LATTE",
    105: "TAHMISCI SPECIAL",
    2: "HOT DRINKS",
    201: "HOT BEVERAGES",
    202: "HOT COFFEES",
    203: "FLAVORED HOT COFFEES",
    204: "TAHMISCI SPECIAL",
    205: "MATCHA LATTE",
    3: "TURKISH COFFEES",
    301: "TURKISH COFFEES",
    4: "DESSERT & SANDWICH",
    401: "SANDWICHES",
    402: "DESSERTS",
    5: "SOFT DRINKS",
    501: "SOFT DRINKS",
    6: "COUNTER PRODUCTS",
    601: "COUNTER PRODUCTS",
    7: "PACKAGED PRODUCTS",
    701: "TURKISH COFFEES",
    702: "COFFEE BEANS"
  };
  const descriptionEn = {
    "buzlu meyve icecegi": "Iced fruit drink",
    "sutlu ve yogun icecek": "Creamy milk drink",
    "soguk icecekler": "Cold beverages",
    "soguk kahveler": "Iced coffees",
    "soguk aromali kahveler": "Flavored iced coffees",
    "sicak icecekler": "Hot beverages",
    "sicak kahveler": "Hot coffees",
    "sicak aromali kahveler": "Flavored hot coffees",
    "kahve": "Coffee",
    "filtre kahve": "Filter coffee",
    "espresso sut": "Espresso + milk",
    "espresso su": "Espresso + water",
    "cift espresso sut": "Double espresso + milk",
    "espresso sut kopugu": "Espresso + milk foam",
    "cikolata sut": "Chocolate + milk",
    "matcha sut": "Matcha + milk",
    "geleneksel turk kahvesi": "Traditional Turkish coffee",
    "turk kahveleri": "Turkish coffees",
    "sandvicler": "Sandwiches",
    "gunluk hazirlanan sandvic": "Fresh daily sandwich",
    "gunluk tatli secenegi": "Daily dessert option",
    "tatlilar": "Desserts",
    "mesrubat": "Soft drinks",
    "kasa onu": "Counter products",
    "kahve cekirdekleri": "Coffee beans",
    "yogun espresso": "Intense espresso",
    "serinletici limon aromasi": "Refreshing lemon flavor",
    "tahmisci special": "Tahmisci special"
  };
  const heroEn = {
    media: heroMedia,
    slides: [
      { title: "Coffee, at its best", description: "Carefully prepared coffees and flavors for every moment of the day.", buttonText: "Explore Menu", buttonIcon: "fas fa-mug-hot", buttonUrl: "#menu", backgroundImage: heroMedia.detail }
    ],
    autoplay: false,
    autoplayInterval: 5500,
    transitionSpeed: 600
  };
  const langFromUrl = (url) => ((url.searchParams.get("lang") || localStorage.getItem("site_language") || "tr").toLowerCase().startsWith("en") ? "en" : "tr");
  const localizedCategoryName = (id, fallback, lang) => lang === "en" ? (categoryNameEn[String(id)] || fallback) : fallback;
  const localizedDescription = (text, lang) => {
    if (lang !== "en") return text;
    const key = normalizeText(text);
    return descriptionEn[key] || text;
  };
  const localizedCategories = (lang) => catalog.categories.map((cat) => ({
    ...cat,
    name: localizedCategoryName(cat.id, cat.name, lang),
    subcategories: Array.isArray(cat.subcategories)
      ? cat.subcategories.map((sub) => ({ ...sub, name: localizedCategoryName(sub.id, sub.name, lang) }))
      : []
  }));
  const localizedProducts = (lang) => catalog.products.map((product) => ({
    ...product,
    description: localizedDescription(product.description, lang),
    categoryName: localizedCategoryName(product.category, product.categoryName, lang),
    parentCategoryName: localizedCategoryName(product.parentCategory, product.parentCategoryName, lang)
  }));
  const productNutritionPayload = (product) => {
    const recipe = findRecipeForProduct(product);
    const details = [];
    if (recipe && recipe.content) {
      details.push({ name: "Reçete içeriği", value: recipe.content, unit: recipe.size ? `(${recipe.size})` : "", sort: 1 });
    }
    const allergens = inferAllergens(`${product?.name || ""} ${product?.description || ""} ${recipe?.content || ""}`);
    if (allergens.length > 0) {
      details.push({ name: "Alerjen", value: allergens.join(", "), unit: "", sort: 2 });
    }
    return {
      nutrition: details,
      products_branches_calories: String(product?.products_branches_calories || "").trim(),
      products_branches_calories_unit: String(product?.products_branches_calories_unit || "").trim()
    };
  };
  window.fetch = function (input, options) {
    const raw = typeof input === "string" ? input : (input && input.url) || "";
    const url = new URL(raw, window.location.href);
    const endpoint = url.pathname.split("/").pop();
    const lang = langFromUrl(url);
    if (!url.pathname.includes("/yeppanel/db/ajax/web/")) return originalFetch ? originalFetch(input, options) : Promise.reject(new Error("Fetch unavailable"));
    if (endpoint === "categories.php") { const categories = localizedCategories(lang); window.MenuCategories = categories; return respond({ success: true, data: { categories } }); }
    if (endpoint === "menu-products.php") { const products = localizedProducts(lang); window.MenuProducts = products; return respond({ success: true, data: { products } }); }
    if (endpoint === "hero.php") return respond({ success: true, data: lang === "en" ? heroEn : hero });
    if (endpoint === "header.php") return respond({ success: true, data: {
      logo: { type: 1, logoUrl: "assets/images/brand/logo.png", logoHeight: "58px", logoLink: "#top", brandName: "Tahmisçi", tagline: lang === "en" ? "Coffee and more" : "Kahve ve daha fazlası", icon: "" },
      navigation: [
        { text: lang === "en" ? "Home" : "Ana Sayfa", url: "#top", icon: "fas fa-house" },
        { text: lang === "en" ? "Menu" : "Menü", url: "#menu", icon: "fas fa-utensils" },
        { text: lang === "en" ? "About" : "Hakkımızda", url: "#about", icon: "fas fa-mug-hot" },
        { text: lang === "en" ? "QR Menu" : "QR Menü", url: "#qr-menu", icon: "fas fa-qrcode" },
        { text: lang === "en" ? "Contact" : "İletişim", url: "#contact", icon: "fas fa-phone" }
      ],
      siteConfig: { default_language: "tr", default_theme: "default", primary_color: "#2E2418", accent_color: "#8C734B", favicon_url: "assets/images/brand/favicon.png" },
      app: { branches: [] }
    } });
    if (endpoint === "footer.php") return respond({ success: true, data: {
      logo: { icon: "", brandName: "Tahmisçi" }, description: lang === "en" ? "Tahmisçi Coffee & Roastery brings coffee, desserts and flavors for every moment of the day together in Torbalı." : "Tahmisçi Coffee & Roastery; kahve, tatlı ve günün her anına eşlik eden lezzetleri Torbalı'da buluşturur.",
      socialLinks: [
        { title: "Instagram", icon: "fab fa-instagram", url: "https://www.instagram.com/tahmiscicoffee?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
        { title: "TikTok", icon: "fab fa-tiktok", url: "https://www.tiktok.com/@tahmiscicoffee" }
      ],
      quickLinks: lang === "en"
        ? [{ text: "Home", url: "#top" }, { text: "Menu", url: "#menu" }, { text: "About", url: "#about" }, { text: "Contact", url: "#contact" }]
        : [{ text: "Ana Sayfa", url: "#top" }, { text: "Menü", url: "#menu" }, { text: "Hakkımızda", url: "#about" }, { text: "İletişim", url: "#contact" }],
      contact: [
        { type: "address", icon: "fas fa-map-marker-alt", text: "Ertuğrul Mahallesi, Sadık İleri Bulvarı No: 42/B, 35860 Torbalı/İzmir", url: "https://www.google.com/maps/search/?api=1&query=Ertu%C4%9Frul%20Mahallesi%20Sad%C4%B1k%20%C4%B0leri%20Bulvar%C4%B1%20No%3A%2042B%2035860%20Torbal%C4%B1%20%C4%B0zmir%20Tahmis%C3%A7i%20Coffee%20%26%20Roastery" },
        { type: "phone", icon: "fas fa-phone", text: "0552 295 46 34", url: "tel:+905522954634" }
      ],
      bottom: { copyright: lang === "en" ? "&copy; 2026 Tahmisçi. All rights reserved." : "&copy; 2026 Tahmisçi. Tüm hakları saklıdır.", links: [] }
    } });
    if (endpoint === "product-options.php") {
      const productId = Number(url.searchParams.get("product_id")) || 0;
      const product = catalog.products.find((item) => Number(item.id) === productId) || null;
      const nutrition = productNutritionPayload(product);
      return respond({ success: true, data: { options: [], nutrition: nutrition.nutrition, products_branches_id: productId, products_branches_company_id: 1, products_branches_calories: nutrition.products_branches_calories, products_branches_calories_unit: nutrition.products_branches_calories_unit } });
    }
    if (endpoint === "product-suboptions.php") return respond({ success: true, data: { options: [] } });
    if (endpoint === "campaigns.php") return respond({ success: true, data: [] });
    if (endpoint === "promotion-engine.php") return respond({ success: true, applied_campaigns: [], applied_promotions: [], free_items: [], coupon_allowed: true, campaign_discount_total_cents: 0 });
    if (endpoint === "validate-promo-code.php") return respond({ success: true, has_active_promotions: false });
    if (endpoint === "popup.php") return respond({ success: true, data: { popup: null } });
    return respond({ success: false, message: "Statik menüde kullanılamaz." });
  };
})();

