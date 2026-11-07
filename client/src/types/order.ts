export interface OrderItem {
  productId: string;
  sellerId: string;
  title: string;
  image: string;
  price: number;
}

export interface Order {
  _id: string;
  buyerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "PLACED";
  createdAt: string;
}