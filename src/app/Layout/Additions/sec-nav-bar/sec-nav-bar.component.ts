import { AfterViewInit, Component, OnInit } from '@angular/core';
import jQuery from 'jquery';
import { CategoryService } from '../../../Shared/Services/category/category.service';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../../Shared/Services/wishlist/wishlist.service';

@Component({
  selector: 'app-sec-nav-bar',
  imports: [RouterModule],
  templateUrl: './sec-nav-bar.component.html',
  styleUrl: './sec-nav-bar.component.css'
})
export class SecNavBarComponent implements AfterViewInit ,OnInit{
  categories: any[] = [];
  wishlistCount: number = 0;
  
  constructor(private categoryService: CategoryService ,   private _WishlistService: WishlistService){ }
  ngOnInit(): void {
    this.fetchCategories();
    this.CounterWishList();
  }

  CounterWishList(){
    this._WishlistService.wishlistCount$.subscribe((count) => {
      this.wishlistCount = count;
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
