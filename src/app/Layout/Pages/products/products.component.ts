import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../Shared/Services/category/category.service';
import { ProductService } from '../../../Shared/Services/product/product.service';
import { ProductCartComponent } from '../product-cart/product-cart.component';
import { SearchService } from '../../../Shared/Services/Search/search.service';
import { Product } from '../../../Shared/Interfaces/product';
import { FilterPipe } from '../../../Shared/Pipe/filter.pipe';
import { BrandsService } from '../../../Shared/Services/brands/brands.service';
import { combineLatest, switchMap } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCartComponent, FilterPipe],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  brands: any[] = [];
  categories: any[] = [];
  loading: boolean = false;
  showMoreBrands = false;
  showMoreCategories = false;
  visibleBrands: any[] = [];
  visibleCategories: any[] = [];
  selectedCategoryId: string = '';
  selectedBrandId: string = '';
  searchTerm: string = '';
  sortBy: string = ''; // '
  constructor(
    private productService: ProductService,
    private brandsService: BrandsService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.sorting();
    this.route.queryParamMap.subscribe(params => {
      this.selectedCategoryId = params.get('category[in]') || '';
      this.selectedBrandId = params.get('brand') || '';
      this.loadProducts();
    });
    
    this.fetchBrands();
    this.fetchCategories();

    this.searchService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      if (term) {
        this.selectedCategoryId = '';
        this.selectedBrandId = '';
      }
    });
  }

  loadProducts(): void {
    if (this.selectedCategoryId) {
      this.getProductsByCategory();
    } else if (this.selectedBrandId) {
      this.getProductsByBrand();
    } else {
      this.fetchProducts();
    }
  }

  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: response => this.products = response.data,
      error: error => console.error('Error fetching products:', error)
    });
  }

  fetchBrands(): void {
    this.brandsService.getAllBrands().subscribe({
      next: response => {
        this.brands = response.data;
        this.updateVisibleBrands();
      },
      error: error => console.error('Error fetching brands:', error)
    });
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: response => {
        this.categories = response.data;
        this.updateVisibleCategories();
      },
      error: error => console.error('Error fetching categories:', error)
    });
  }

  getProductsByCategory(): void {
    this.loading = true;
    this.productService.getProductsByCategory(this.selectedCategoryId).subscribe({
      next: response => {
        this.products = response.data;
        this.loading = false;
      },
      error: error => {
        console.error('Error fetching products by category:', error);
        this.loading = false;
      }
    });
  }

  getProductsByBrand(): void {
    this.loading = true;
    this.productService.getProductsByBrand(this.selectedBrandId).subscribe({
      next: response => {
        this.products = response.data;
        this.loading = false;
      },
      error: error => {
        console.error('Error fetching products by brand:', error);
        this.loading = false;
      }
    });
  }

  updateVisibleBrands(): void {
    this.visibleBrands = this.showMoreBrands ? this.brands : this.brands.slice(0, 5);
  }

  updateVisibleCategories(): void {
    this.visibleCategories = this.showMoreCategories ? this.categories : this.categories.slice(0, 5);
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
    const queryParams: any = {};

    // Add selected category and brand to query params
    if (this.selectedCategoryId) {
      queryParams['category[in]'] = this.selectedCategoryId;
    }
    if (this.selectedBrandId) {
      queryParams['brand'] = this.selectedBrandId;
    }
    if (this.searchTerm) {
      queryParams['search'] = this.searchTerm;
    }
    if (this.sortBy) {
      queryParams['sort'] = this.sortBy; // e.g., 'price' or '-price'
    }

    // Update the URL with the new query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge', // Keep existing query params and merge new ones
    });
  }


  onCategoryChange(event: any, categoryId: string): void {
    this.selectedCategoryId = event.target.checked ? categoryId : '';
    this.updateQueryParams();
  }

  onBrandChange(event: any, brandId: string): void {
    this.selectedBrandId = event.target.checked ? brandId : '';
    this.updateQueryParams();
  }

  onSortChange(event: any): void {
    this.sortBy = event.target.value; // '', 'price', or '-price'
    this.updateQueryParams();
  }

  sorting() {
    combineLatest([
      this.route.queryParamMap,
      this.searchService.currentSearchTerm,
    ]).pipe(
      switchMap(([params, searchTerm]) => {
        this.searchTerm = searchTerm;
        const categoryId = params.get('category[in]');
        const brandId = params.get('brand');
        const sort = params.get('sort') || this.sortBy;
  
        // Update component state
        this.selectedCategoryId = categoryId || '';
        this.selectedBrandId = brandId || '';
        this.sortBy = sort || '';
  
        this.loading = true;
        
        // Determine which API call to make based on current state
        if (searchTerm) {
          // When searching, ignore category/brand filters
          return this.productService.searchProducts(searchTerm, this.sortBy);
        } else if (categoryId) {
          return this.productService.getProductsByCategory(categoryId, this.sortBy);
        } else if (brandId) {
          return this.productService.getProductsByBrand(brandId, this.sortBy);
        } else {
          return this.productService.getAllProducts(this.sortBy);
        }
      })
    ).subscribe({
      next: (response) => {
        this.products = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.loading = false;
      },
    });
  }

}
