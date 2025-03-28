import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../Shared/shared/shared.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../../Shared/Services/wishlist/wishlist.service';
import { AuthService } from '../../../Shared/Services/auth/auth.service';

@Component({
  selector: 'app-product-cart',
  imports: [RouterLink,CommonModule],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css'
})
export class ProductCartComponent implements OnInit {
  @Input() product: any;
  wishlistProductIds: string[] = [];
  isLoggedIn = false;
  
  constructor(
    public _WishlistService: WishlistService,
    public sharedService: SharedService,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private el: ElementRef,
    private _AuthService:AuthService
  ) {

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
      const wishlistButtons = this.el.nativeElement.querySelectorAll('.wishlist-btn');
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
      },
      error: (err) => this.toastr.error('Failed to remove from wishlist')
    });
  } else {
    this._WishlistService.AddProductToWishlist(productId).subscribe({
      next: () => {
        this.wishlistProductIds = [...this.wishlistProductIds, productId];
        this.updateIconStyle(iconElement, true);
        this.toastr.success('Added to wishlist');
      },
      error: (err) => this.toastr.error('Failed to add to wishlist')
    });
  }
}


}