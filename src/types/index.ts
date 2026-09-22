export type CategoryType = 'all' | 't-shirts' | 'hoodies' | 'shirts' | 'pants' | 'new-arrivals' | 'best-sellers';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  sizePurchased?: string;
}

export interface Product {
  id: string;
  name: string;
  tagline?: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: CategoryType;
  categoryLabel: string;
  colors: ProductColor[];
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  images: {
  id: number;
  url: string;
  alt: string;
  sort_order: number;
}[];
  description: string;
  details: string[];
  fabric: string;
  gsm: string;
  fit: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  stock: Record<string, number>;
  reviews?: Review[];
}

export interface CartItem {
  id: string; // generated unique combo id e.g. productId-size-color
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: 'razorpay' | 'upi' | 'card' | 'cod';
  paymentStatus: 'paid' | 'cod_pending' | 'created' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface FilterState {
  category: string;
  sizes: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
}
