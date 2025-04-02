import {
  AfterViewInit,
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';
import jQuery from 'jquery';
import { CategoryService } from '../../../Shared/Services/category/category.service';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { WishlistService } from '../../../Shared/Services/wishlist/wishlist.service';
import { CartService } from '../../../Shared/Services/cart/cart.service';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../Shared/Services/product/product.service';
import { SearchService } from '../../../Shared/Services/Search/search.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sec-nav-bar',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './sec-nav-bar.component.html',
  styleUrl: './sec-nav-bar.component.css',
})
export class SecNavBarComponent implements AfterViewInit, OnInit {
  categories: any[] = [];
  wishlistCount: number = 0;
  CartCount: number = 0;
  cartItems = signal<any[]>([]);
  cartId = signal<string>('');
  total = signal<number>(0);

  constructor(
    private categoryService: CategoryService,
    private _WishlistService: WishlistService,
    private cartService: CartService,
    private router: Router,
    private SearchService: SearchService,
    private toastr: ToastrService
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
    this.cartService.CartCount$.subscribe((count) => {
      this.CartCount = count;
    });

    this._WishlistService.wishlistCount$.subscribe((count) => {
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
              sum + item.price * item.count,
            0
          );
          this.total.set(newTotal);
        }
      },
    });
  }

  ngAfterViewInit(): void {
    jQuery(
      '.ht-setting-trigger, .ht-currency-trigger, .ht-language-trigger, .hm-minicart-trigger, .cw-sub-menu'
    ).on('click', function (e) {
      e.preventDefault();
      $(this).toggleClass('is-active');
      $(this)
        .siblings(
          '.ht-setting, .ht-currency, .ht-language, .minicart, .cw-sub-menu li'
        )
        .slideToggle();
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

  selectedCategory: string = '';
  searchQuery: string = '';
  currentCategory: string = '';

  onCategorySelect(): void {
    this.searchQuery = '';
    const navigationExtras: NavigationExtras = {
      queryParams: { 'category[in]': this.selectedCategory },
      queryParamsHandling: 'merge',
      skipLocationChange: false,
    };

    if (this.selectedCategory === this.currentCategory) {
      this.searchQuery = '';
      this.router
        .navigate(['/refresh'], navigationExtras)
        .then(() => this.router.navigate(['/products'], navigationExtras));
    } else {
      this.searchQuery = '';
      this.currentCategory = this.selectedCategory;
      this.router.navigate(['/products'], navigationExtras);
    }
  }

  onSearchInput(): void {
    // Update the search term through the service
    this.SearchService.updateSearchTerm(this.searchQuery);
    
    // Clear other filters when searching
    if (this.searchQuery.trim().length > 0) {
      this.selectedCategory = '';
      this.currentCategory = '';
      this.router.navigate(['/products'], { 
        queryParams: { 
          'category[in]': null,
          'brand': null,
          'sort': null
        },
        queryParamsHandling: 'merge'
      });
    }
  }
  removeItem(productId: string) {
    this.cartService.RemoveSpecificCartItem(productId).subscribe({
      next: () => {
        this.toastr.error('Item removed');
        this.loadCartItems();
      },
      error: () => this.toastr.error('Failed to remove item'),
    });
  }
}
