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
