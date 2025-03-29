import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { WishlistService } from '../../../Shared/Services/wishlist/wishlist.service';
import { Product } from '../../../Shared/Interfaces/product';
import { CartService } from '../../../Shared/Services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-wish-list',
  imports: [NgxSpinnerModule ,CurrencyPipe],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {

  wishlistItems: WritableSignal<Product[]> = signal([]);
  isLoading = signal<boolean>(true);

  constructor(private _WishlistService: WishlistService, 
              private _CartService: CartService, 
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  addProductToCard(pId: string) {
    this._CartService.AddProducttoCart(pId).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
        this.toastr.error('Failed to add product to cart');
      }
    });
  }

  loadWishlist() {
    this.isLoading.set(true);
    this._WishlistService.GetLoggedUserWishlist().subscribe({
      next: (wishList) => {
        this.wishlistItems.set(wishList.data as Product[]);
        this.isLoading.set(false);  
      },
      error: (err) => {
        console.error('Error loading wishlist', err);
        this.toastr.error('Failed to load wishlist');
        this.isLoading.set(false);
      }
    });
  }

  removeFromWishList(pId: string) {
    this._WishlistService.RemoveProductFromWishlist(pId).subscribe({
      next: (res: any) => {
        this.wishlistItems.update(items => items.filter(item => item._id !== pId));
        this.toastr.error(res.message);
      },
      error: (error) => {
        console.error('Error removing product from wishlist: ', error);
        this.toastr.error('Failed to remove product from wishlist');
      }
    });
  }
}
