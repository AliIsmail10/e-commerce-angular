import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../Shared/shared/shared.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../../Shared/Services/wishlist/wishlist.service';
<<<<<<< HEAD
import { AuthService } from '../../../Shared/Services/auth/auth.service';
=======
import { CartService } from '../../../Shared/Services/cart/cart.service';
>>>>>>> 8ca80bbf027dd5e3762ce111d147be66305ca774

@Component({
  selector: 'app-product-cart',
  imports: [RouterLink, CommonModule],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css',
})
export class ProductCartComponent implements OnInit {
  @Input() product: any;
  wishlistProductIds: string[] = [];
<<<<<<< HEAD
  isLoggedIn = false;
  
=======

>>>>>>> 8ca80bbf027dd5e3762ce111d147be66305ca774
  constructor(
    public _WishlistService: WishlistService,
    public sharedService: SharedService,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private el: ElementRef,
<<<<<<< HEAD
    private _AuthService:AuthService
  ) {
=======
    private _CartService: CartService
  ) {}
>>>>>>> 8ca80bbf027dd5e3762ce111d147be66305ca774

    if (this._AuthService.isLoggedIn()) {
      this.fetchWishlist();
    }
  }


  ngOnInit(): void {
    this._AuthService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.fetchWishlist();
      } else {
        this.wishlistProductIds = [];
      }
    });
  }
  ngAfterViewInit(): void {
    this.updateWishlistIcons();
  }


  
  private updateWishlistIcons() {
    setTimeout(() => {
      const wishlistButtons =
        this.el.nativeElement.querySelectorAll('.wishlist-btn');
      wishlistButtons.forEach((button: HTMLElement) => {
        const productId = button.getAttribute('data-product-id');
        const icon = button.querySelector('i');
        if (icon && productId) {
          const isInWishlist = this.wishlistProductIds.includes(productId);
          this.updateIconStyle(icon, isInWishlist);
        }
      });
    }, 0);
  }

  private updateIconStyle(icon: Element, isInWishlist: boolean) {
    this.renderer.removeClass(icon, isInWishlist ? 'fa-heart-o' : 'fa-heart');
    this.renderer.addClass(icon, isInWishlist ? 'fa-heart' : 'fa-heart-o');
    this.renderer.setStyle(icon, 'color', isInWishlist ? 'red' : 'gray');
  }

  toggleWishlist(productId: string, event: Event) {
    event.stopPropagation();
    if (!productId) return;

<<<<<<< HEAD
fetchWishlist() {
  this._WishlistService.GetLoggedUserWishlist().subscribe({
    next: (wishList) => {
      this.wishlistProductIds = wishList.data?.map((item: any) => item.id) || [];
      this.updateWishlistIcons();
    },
    error: (error) => {
      console.error('Error fetching wishlist:', error);
    }
  });
}

toggleWishlist(productId: string, event: Event) {
  event.stopPropagation();
  
  if (!this.isLoggedIn) {
    this.toastr.error('Please login to manage your wishlist');
    return;
  }

  const button = event.currentTarget as HTMLElement;
  const iconElement = button.querySelector('i');
  if (!iconElement) return;

  const isInWishlist = this.wishlistProductIds.includes(productId);
  
  if (isInWishlist) {
    this._WishlistService.RemoveProductFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistProductIds = this.wishlistProductIds.filter(id => id !== productId);
        this.updateIconStyle(iconElement, false);
        this.toastr.success('Removed from wishlist');
=======
    const button = event.currentTarget as HTMLElement;
    const iconElement = button.querySelector('i');
    if (!iconElement) return;

    if (!this.wishlistProductIds.includes(productId)) {
      this.renderer.addClass(button, 'added');
      setTimeout(() => this.renderer.removeClass(button, 'added'), 500);
    }

    const isInWishlist = this.wishlistProductIds.includes(productId);

    if (isInWishlist) {
      this._WishlistService.RemoveProductFromWishlist(productId).subscribe({
        next: () => {
          this.wishlistProductIds = this.wishlistProductIds.filter(
            (id) => id !== productId
          );
          this.updateIconStyle(iconElement, false);
          this.toastr.error('Removed from wishlist');
        },
        error: (err) => this.toastr.error('Failed to remove from wishlist'),
      });
    } else {
      this._WishlistService.AddProductToWishlist(productId).subscribe({
        next: () => {
          this.wishlistProductIds = [...this.wishlistProductIds, productId];
          this.updateIconStyle(iconElement, true);
          this.toastr.success('Added to wishlist');
        },
        error: (err) => this.toastr.error('Failed to add to wishlist'),
      });
    }
  }

  addToCart(productId: string) {
    if (!productId) return;

    this._CartService.AddProducttoCart(productId).subscribe({
      next: (response) => {
        this.toastr.success('Product added to cart successfully!');

        this._CartService.cartItem.next(this._CartService.cartItem.value + 1);
>>>>>>> 8ca80bbf027dd5e3762ce111d147be66305ca774
      },
      error: (err) => {
        this.toastr.error('Failed to add product to cart');
        console.error('Add to cart error:', err);
      },
    });
  }
}
<<<<<<< HEAD


}
=======
>>>>>>> 8ca80bbf027dd5e3762ce111d147be66305ca774
