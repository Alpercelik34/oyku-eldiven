import "server-only";
import { unstable_cache } from "next/cache";
import * as jsonDb from "./db-json";
import * as pgDb from "./db-postgres";

// DATABASE_URL tanımlıysa Postgres (canlı), değilse JSON dosyaları (yerel).
const impl: typeof jsonDb = process.env.DATABASE_URL ? pgDb : jsonDb;

// Okuma fonksiyonları istekler ARASI önbelleğe alınır (Vercel Data Cache).
// Uzak veritabanına her sayfa görüntülemede bağlanmak sayfa başına saniyeler
// kaybettiriyordu; önbellek sayesinde DB'ye yalnızca veri değiştiğinde
// (admin kaydettiğinde revalidateTag ile) veya TTL dolunca gidilir.
// Siparişler bilerek önbelleksiz: her zaman taze okunmalı.
export const CACHE_TAGS = {
  settings: "settings",
  categories: "categories",
  products: "products",
} as const;

// TTL, kaçırılan bir tag tazelemesine karşı emniyet supabıdır;
// normal akışta güncelleme tag üzerinden anında yansır.
const TTL = 60 * 10;

// ---- Site Ayarları ----
export const getSettings = unstable_cache(impl.getSettings, ["getSettings"], {
  tags: [CACHE_TAGS.settings],
  revalidate: TTL,
});
export const saveSettings = impl.saveSettings;

// ---- Kategoriler ----
export const getCategories = unstable_cache(
  impl.getCategories,
  ["getCategories"],
  { tags: [CACHE_TAGS.categories], revalidate: TTL },
);
export const getCategory = unstable_cache(impl.getCategory, ["getCategory"], {
  tags: [CACHE_TAGS.categories],
  revalidate: TTL,
});
export const saveCategory = impl.saveCategory;
export const deleteCategory = impl.deleteCategory;

// ---- Ürünler ----
export const getProducts = unstable_cache(impl.getProducts, ["getProducts"], {
  tags: [CACHE_TAGS.products],
  revalidate: TTL,
});
export const getProduct = unstable_cache(impl.getProduct, ["getProduct"], {
  tags: [CACHE_TAGS.products],
  revalidate: TTL,
});
export const getProductById = unstable_cache(
  impl.getProductById,
  ["getProductById"],
  { tags: [CACHE_TAGS.products], revalidate: TTL },
);
export const getProductsByCategory = unstable_cache(
  impl.getProductsByCategory,
  ["getProductsByCategory"],
  { tags: [CACHE_TAGS.products], revalidate: TTL },
);
export const getFeaturedProducts = unstable_cache(
  impl.getFeaturedProducts,
  ["getFeaturedProducts"],
  { tags: [CACHE_TAGS.products], revalidate: TTL },
);
export const searchProducts = unstable_cache(
  impl.searchProducts,
  ["searchProducts"],
  { tags: [CACHE_TAGS.products], revalidate: TTL },
);
export const saveProduct = impl.saveProduct;
export const deleteProduct = impl.deleteProduct;

// ---- Siparişler (önbelleksiz) ----
export const getOrders = impl.getOrders;
export const getOrderById = impl.getOrderById;
export const saveOrder = impl.saveOrder;
export const updateOrderStatus = impl.updateOrderStatus;
