export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type GearCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";
export type RentalOrderStatus =
  "PLACED" | "CONFIRMED" | "CANCELLED" | "PAID" | "PICKED_UP" | "RETURNED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string | null;
  address: string | null;
  businessName: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
}

export interface UserPreview {
  id: string;
  name: string;
  businessName?: string | null;
  avatarUrl?: string | null;
}

export interface GearItem {
  id: string;
  providerId: string;
  categoryId: string;
  name: string;
  description: string;
  brand: string | null;
  images: string[];
  pricePerDay: string;
  securityDeposit: string;
  quantityTotal: number;
  quantityAvailable: number;
  condition: GearCondition;
  location: string;
  specifications: Record<string, unknown> | null;
  isActive: boolean;
  avgRating: number;
  reviewCount: number;
  createdAt: string;
  category?: { id: string; name: string; slug: string };
  provider?: UserPreview;
  reviews?: Review[];
}

export interface RentalOrderItem {
  id: string;
  gearItemId: string;
  quantity: number;
  pricePerDay: string;
  days: number;
  lineTotal: string;
  gearItem?: { id: string; name: string; images: string[]; condition: GearCondition };
}

export interface RentalOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  providerId: string;
  status: RentalOrderStatus;
  startDate: string;
  endDate: string;
  totalDays: number;
  subtotal: string;
  depositTotal: string;
  totalAmount: string;
  deliveryAddress: string | null;
  notes: string | null;
  cancelReason: string | null;
  createdAt: string;
  items: RentalOrderItem[];
  customer?: { id: string; name: string; email: string; phone: string | null };
  provider?: { id: string; name: string; businessName: string | null; phone: string | null };
}

export interface Payment {
  id: string;
  transactionId: string;
  rentalOrderId: string;
  provider: "SSLCOMMERZ" | "STRIPE";
  method: string | null;
  amount: string;
  currency: string;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  rentalOrder?: { orderNumber: string; status?: RentalOrderStatus };
}

export interface Review {
  id: string;
  customerId: string;
  gearItemId: string;
  rentalOrderId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer?: { name: string; avatarUrl: string | null };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorShape {
  success: false;
  message: string;
  errorDetails: ApiErrorDetail[];
}
