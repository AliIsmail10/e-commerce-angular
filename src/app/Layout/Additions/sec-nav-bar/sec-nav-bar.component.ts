import { AfterViewInit, Component, computed, OnInit, signal } from '@angular/core';
import jQuery from 'jquery';
import { CategoryService } from '../../../Shared/Services/category/category.service';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../../Shared/Services/wishlist/wishlist.service';
import { CartService } from '../../../Shared/Services/cart/cart.service';

@Component({
  selector: 'app-sec-nav-bar',
  imports: [RouterModule],
  templateUrl: './sec-nav-bar.component.html',
  styleUrl: './sec-nav-bar.component.css'
})
export class SecNavBarComponent implements AfterViewInit, OnInit {
  categories: any[] = [];
  wishlistCount: number = 0;
  CartCount: number = 0;
  cartItems = signal<any[]>([]); 
  cartId = signal<string>("");
  total = signal<number>(0);

  constructor(
    private categoryService: CategoryService,
    private _WishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.subscribeToCounters();
    this.loadCartItems();

    this.cartService.cartUpdates$.subscribe(() => {
      this.loadCartItems();
    });
  }

  private subscribeToCounters() {
    this.cartService.CartCount$.subscribe(count => {
      this.CartCount = count;
    });

    this._WishlistService.wishlistCount$.subscribe(count => {
      this.wishlistCount = count;
    });
  }
  loadCartItems() {
    this.cartService.GetLoggedUserCart().subscribe({
      next: (response) => {
        if (response?.data?.products) {
          this.cartItems.set(response.data.products);
          this.cartId.set(response.data._id);
          
          const newTotal = response.data.products.reduce(
            (sum: number, item: { price: number; count: number }) => 
              sum + (item.price * item.count), 
            0
          );
          this.total.set(newTotal);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    jQuery('.ht-setting-trigger, .ht-currency-trigger, .ht-language-trigger, .hm-minicart-trigger, .cw-sub-menu').on('click', function (e) {
      e.preventDefault();
      $(this).toggleClass('is-active');
      $(this).siblings('.ht-setting, .ht-currency, .ht-language, .minicart, .cw-sub-menu li').slideToggle();
    });
    $('.ht-setting-trigger.is-active').siblings('.catmenu-body').slideDown();
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }
}