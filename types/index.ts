export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: string | null;
  images: string[];
  coa_images: string[];
  stock: number;
  featured: boolean;
  created_at: string;
  // Product detail page fields (nullable — page must hide rows/sections
  // gracefully when unset rather than showing empty/placeholder values)
  purity: string | null;
  analysis_method: string | null;
  storage_temp: string | null;
  form: string | null;
  amount_mg: string | null;
  description_sl: string | null;
  description_en: string | null;
  coa_url: string | null;
  msds_url: string | null;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customer_name: string | null;
  customer_email: string | null;
  customer_address: string | null;
  payment_method: "bank" | "whatsapp";
  status: "pending_payment" | "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  created_at: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  author: string | null;
  reading_time: number | null;
  published_at: string;
  created_at: string;
}

export interface CoaDocument {
  id: string;
  product_id: string;
  batch_number: string | null;
  test_date: string | null;
  file_url: string | null;
  file_size: string | null;
  status: string;
  created_at: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  label: string | null;
  subtitle: string | null;
  button_text: string;
  button_link: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}
