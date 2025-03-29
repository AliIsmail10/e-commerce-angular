import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../../Shared/Services/wishlist/wishlist.service';
import { AuthService } from '../../../Shared/Services/auth/auth.service';
import { CartService } from '../../../Shared/Services/cart/cart.service';
import { Subscription } from 'rxjs';

interface WishlistItem {
  id: string;
  // Add other properties as needed
}

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-cart.component.html',
  styleUrls: ['./product-cart.component.css']
})
export class ProductCartComponent implements OnInit, OnDestroy {
  @Input() product: any;
  wishlistProductIds: string[] = [];
  isLoggedIn = false;
  private authSubscription!: Subscription;

  constructor(
    private wishlistService: WishlistService,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private el: ElementRef,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.fetchWishlist();
      } else {
        this.wishlistProductIds = [];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.updateWishlistIcons();
  }

  private updateWishlistIcons(): void {
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

  private updateIconStyle(icon: Element, isInWishlist: boolean): void {
    this.renderer.removeClass(icon, isInWishlist ? 'fa-heart-o' : 'fa-heart');
    this.renderer.addClass(icon, isInWishlist ? 'fa-heart' : 'fa-heart-o');
    this.renderer.setStyle(icon, 'color', isInWishlist ? 'red' : 'gray');
  }

  addToCart(productId: string): void {
    if (!productId) return;

    this.cartService.AddProducttoCart(productId).subscribe({
      next: (response: any) => {
        this.toastr.success('Product added to cart successfully!');
      },
      error: (err: any) => {
        this.toastr.error('Failed to add product to cart');
        console.error('Add to cart error:', err);
      }
    });
  }

  fetchWishlist(): void {
    this.wishlistService.GetLoggedUserWishlist().subscribe({
      next: (wishList: { data?: WishlistItem[] }) => {
        this.wishlistProductIds = wishList.data?.map(item => item.id) || [];
        this.updateWishlistIcons();
      },
      error: (error: any) => {
        console.error('Error fetching wishlist:', error);
      }
    });
  }

  toggleWishlist(productId: string, event: Event): void {
    event.stopPropagation();
    
    if (!this.isLoggedIn) {
      this.toastr.error('Please login to manage your wishlist');
      this.router.navigate(['/login']);
      return;
    }

    const button = event.currentTarget as HTMLElement;
    const iconElement = button.querySelector('i');
    if (!iconElement) return;

    const isInWishlist = this.wishlistProductIds.includes(productId);
    
    if (!isInWishlist) {
      this.renderer.addClass(button, 'added');
      setTimeout(() => this.renderer.removeClass(button, 'added'), 500);
    }

    if (isInWishlist) {
      this.removeFromWishlist(productId, iconElement);
    } else {
      this.addToWishlist(productId, iconElement);
    }
  }

  private addToWishlist(productId: string, iconElement: Element): void {
    this.wishlistService.AddProductToWishlist(productId).subscribe({
      next: () => {
        this.wishlistProductIds = [...this.wishlistProductIds, productId];
        this.updateIconStyle(iconElement, true);
        this.toastr.success('Added to wishlist');
      },
      error: (err: any) => {
        this.toastr.error('Failed to add to wishlist');
      }
    });
  }

  private removeFromWishlist(productId: string, iconElement: Element): void {
    this.wishlistService.RemoveProductFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistProductIds = this.wishlistProductIds.filter(id => id !== productId);
        this.updateIconStyle(iconElement, false);
        this.toastr.success('Removed from wishlist');
      },
      error: (err: any) => {
        this.toastr.error('Failed to remove from wishlist');
      }
    });
  }
}