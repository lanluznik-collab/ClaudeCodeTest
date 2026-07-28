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
  order_ref: string | null;
  items: CartItem[];
  total: number;
  subtotal: number | null;
  shipping_cost: number | null;
  discount_code: string | null;
  discount_amount: number;
  cod_surcharge: number;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  company_name: string | null;
  vat_id: string | null;
  consent_terms_at: string | null;
  consent_ruo_at: string | null;
  payment_method: "bank_transfer" | "cod" | "whatsapp";
  status: "pending_payment" | "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  language: "sl" | "en";
  predracun_number: string | null;
  predracun_pdf_path: string | null;
  declaration_pdf_path: string | null;
  confirmation_sent_at: string | null;
  created_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  expires_at: string | null;
  min_order: number | null;
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

export interface LocalizedText {
  slo: string;
  eng: string;
}

export interface BlogBodySection {
  head: LocalizedText;
  text: LocalizedText;
}

export interface BlogPost {
  id: string;
  slug: string;
  tag: string | null;
  tag_icon: string | null;
  published_at: string;
  read_minutes: number | null;
  cover_image: string | null;
  title: LocalizedText;
  intro: LocalizedText;
  body: BlogBodySection[];
  cta_product: string | null;
  author: string | null;
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
