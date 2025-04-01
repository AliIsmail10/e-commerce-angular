import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { Subscription } from 'rxjs'; // Import Subscription for handling observable cleanup
import { BrandsService } from '../../../Shared/Services/brands/brands.service';
import { CategoryService } from '../../../Shared/Services/category/category.service';
import { ProductService } from '../../../Shared/Services/product/product.service';
import { ProductCartComponent } from '../product-cart/product-cart.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCartComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: any[] = [];
  brands: any[] = [];
  categories: any[] = [];
  loading: boolean = false;
  showMoreBrands = false;
  showMoreCategories = false;
  visibleBrands: any[] = [];
  visibleCategories: any[] = [];
  selectedCategoryId: string = '';
  selectedBrandId: string = '';
  queryParamsSubscription: Subscription | undefined;

  constructor(
    private productService: ProductService,
    private brandsService: BrandsService,
    private categoryService: CategoryService,
    private route: ActivatedRoute, // Keep ActivatedRoute for accessing route params
    private router: Router // Correctly inject Router for navigating
  ) {}

  ngOnInit(): void {
    // Fetch initial data (brands and categories)
    this.fetchBrands();
    this.fetchCategories();
    this.fetchProducts(); // Fetch all products initially

    // Subscribe to query param changes and update products accordingly
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        this.selectedCategoryId = params['category[in]'] || '';
        this.selectedBrandId = params['brand'] || '';
        this.getProductsByFilters(); // Fetch filtered products based on the current query params
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from queryParamsSubscription when the component is destroyed
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        this.products = response.data;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  fetchBrands(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (response) => {
        this.brands = response.data;
        this.updateVisibleBrands();
      },
      error: (error) => {
        console.error('Error fetching brands:', error);
      },
    });
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.updateVisibleCategories();
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  updateVisibleBrands(): void {
    this.visibleBrands = this.showMoreBrands
      ? this.brands
      : this.brands.slice(0, 5);
  }

  onCategoryChange(event: any, categoryId: string): void {
    if (event.target.checked) {
      this.selectedCategoryId = categoryId; // Set single category ID
    } else {
      this.selectedCategoryId = ''; // Clear category if unchecked
    }

    this.updateQueryParams(); // Update query parameters based on the selection
  }

  onBrandChange(event: any, brandId: string): void {
    if (event.target.checked) {
      this.selectedBrandId = brandId; // Set the selected brand ID
    } else {
      this.selectedBrandId = ''; // Clear the selected brand ID if unchecked
    }

    this.updateQueryParams(); // Update query parameters based on the selection
  }

  updateVisibleCategories(): void {
    this.visibleCategories = this.showMoreCategories
      ? this.categories
      : this.categories.slice(0, 5);
  }

  toggleShowMore(type: 'brands' | 'categories'): void {
    if (type === 'brands') {
      this.showMoreBrands = !this.showMoreBrands;
      this.updateVisibleBrands();
    } else {
      this.showMoreCategories = !this.showMoreCategories;
      this.updateVisibleCategories();
    }
  }

  updateQueryParams(): void {
    let queryParams: any = {};

    // Add selected category and brand to query params
    if (this.selectedCategoryId) {
      queryParams['category[in]'] = this.selectedCategoryId;
    }
    if (this.selectedBrandId) {
      queryParams['brand'] = this.selectedBrandId;
    }

    // Update the URL with the new query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge', // Keep existing query params and merge new ones
    });
  }

  getProductsByFilters(): void {
    this.loading = true;

    // Apply category filter if exists
    if (this.selectedCategoryId) {
      this.productService
        .getProductsByCategory(this.selectedCategoryId)
        .subscribe({
          next: (response) => {
            this.products = response.data;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error fetching products by category:', error);
            this.loading = false;
          },
        });
      return; // Early exit if category filter is applied
    }

    // Apply brand filter if exists
    if (this.selectedBrandId) {
      this.productService.getProductsByBrand(this.selectedBrandId).subscribe({
        next: (response) => {
          this.products = response.data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching products by brand:', error);
          this.loading = false;
        },
      });
      return; // Early exit if brand filter is applied
    }

    // Fetch all products if no filters are applied
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching all products:', error);
        this.loading = false;
      },
    });
  }
}
