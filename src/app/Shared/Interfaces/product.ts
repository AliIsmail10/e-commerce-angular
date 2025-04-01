
export interface Product {
    sold: number;
    images: string[];
    subcategory: Subcategory[];
    ratingsQuantity: number;
    _id: string;
    title: string;
    slug: string;
    description: string;
    quantity: number;
    price: number;
    imageCover: string;
    category: Category;
    brand: Category;
    ratingsAverage: number;
    createdAt: string;
    updatedAt: string;
    id: string;
  }
  
  interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
  }
  
  interface Subcategory {
    _id: string;
    name: string;
    slug: string;
    category: string;
  }

  export interface Cart {
    status: string;
    numOfCartItems: number;
    cartId: string;
    data: Data;
  }
  
interface Data {
  _id: string;
  cartOwner: string;
  products: CartItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

export interface CartItem {
  count: number
  _id: string
  product: Product
  price: number
}

export interface Brand {
  _id: string
  name: string
  slug: string
  image: string
}


export interface ShippingAddress {
  details: string
  phone: string
  city: string
}

export interface Order {
  shippingAddress: ShippingAddress
  taxPrice: number
  shippingPrice: number
  totalOrderPrice: number
  paymentMethodType: string
  isPaid: boolean
  isDelivered: boolean
  _id: string
  user: User
  cartItems: CartItem[]
  paidAt: string
  createdAt: string
  updatedAt: string
  id: number
  [key: string]: any; 
}

export interface User {
  _id: string
  name: string
  email: string
  phone: string
}