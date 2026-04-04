export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: string | null;
  images: string[];
  stock: number;
  featured: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  stripe_session_id: string | null;
  items: CartItem[];
  total: number;
  customer_name: string | null;
  customer_email: string | null;
  payment_method: "stripe" | "whatsapp";
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
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
