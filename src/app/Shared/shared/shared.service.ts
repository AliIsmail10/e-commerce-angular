import { Injectable, signal, WritableSignal } from '@angular/core';
import { CartService } from '../Services/cart/cart.service';
import { ProductService } from '../Services/product/product.service';
import { WishlistService } from '../Services/wishlist/wishlist.service';
import { Product } from '../Interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  productList: WritableSignal<Product[]> = signal([]);
  isLoding: boolean = false;
  wishlistProductIds: string[] = [];

  constructor(
    private _ProductService: ProductService,
    private _CartService: CartService,
    private _WishlistService: WishlistService,
  ) {}

  fetchProducts(searchTerm: string = '') {
    return this._ProductService.getAllProducts().subscribe({
      next: (products: any) => {
        this.productList.set(products.data);
      },
      error: (error) => {
        console.error('Error fetching products: ', error);
      },
    });
  }

  
  fetchWishlist() {
    return this._WishlistService.GetLoggedUserWishlist().subscribe({
      next: (wishList) => {
        this.wishlistProductIds = wishList.data.map((item: any) => item.id);
      },
      error: (error) => {
        console.error('Error fetching wishlist: ', error);
      },
    });
  }

  toggleWishlist(productId: string) {
    const isInWishlist = this.isProductInWishlist(productId);
    if (isInWishlist) {
      this.removeFromWishlist(productId);
    } else {
      this.addToWishlist(productId);
    }
  }

  isProductInWishlist(productId: string): boolean {
    return this.wishlistProductIds.includes(productId);
  }

  // Add product to the wishlist
  private addToWishlist(productId: string) {
    return this._WishlistService.AddProductToWishlist(productId).subscribe({
      next: (res: any) => {
        this.wishlistProductIds.push(productId);
      },
      error: (error) => {
        console.error('Error adding product to wishlist: ', error);
      },
    });
  }

  private removeFromWishlist(productId: string) {
    return this._WishlistService.RemoveProductFromWishlist(productId).subscribe({
      next: (res: any) => {
        this.wishlistProductIds = this.wishlistProductIds.filter(id => id !== productId);
      },
      error: (error) => {
        console.error('Error removing product from wishlist: ', error);
      },
    });
  }
}
