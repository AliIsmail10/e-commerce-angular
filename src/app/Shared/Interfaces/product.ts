
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
  products: Product2[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

interface Product2 {
  count: number;
  _id: string;
  product: Product;
  price: number;
}