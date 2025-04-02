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
import { combineLatest } from 'rxjs';

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
  sortBy: string = '';
  filteredProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private brandsService: BrandsService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    
      
    this.fetchBrands();
    this.fetchCategories();
    
    // Handle search term changes
    this.searchService.currentSearchTerm.subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.applyFilters();
    });

    // Handle route changes for filters
    this.route.queryParamMap.subscribe(params => {
      this.selectedCategoryId = params.get('category[in]') || '';
      this.selectedBrandId = params.get('brand') || '';
      this.sortBy = params.get('sort') || '';
      this.loadProducts();
    });
  }
  loadProducts(): void {
    this.loading = true;
    
    let apiCall;
    if (this.selectedCategoryId) {
      apiCall = this.productService.getProductsByCategory(this.selectedCategoryId, this.sortBy);
    } else if (this.selectedBrandId) {
      apiCall = this.productService.getProductsByBrand(this.selectedBrandId, this.sortBy);
    } else {
      apiCall = this.productService.getAllProducts(this.sortBy);
    }

    apiCall.subscribe({
      next: response => {
        this.products = response.data;
        this.filteredProducts = [...this.products]; // Initialize filtered products
        this.applyFilters();
        this.loading = false;
      },
      error: error => {
        console.error('Error fetching products:', error);
        this.loading = false;
      }
    });
  }
  setupSearchAndFilters(): void {
    combineLatest([
      this.route.queryParamMap,
      this.searchService.currentSearchTerm
    ]).subscribe(([params, searchTerm]) => {
      this.searchTerm = searchTerm || '';
      this.selectedCategoryId = params.get('category[in]') || '';
      this.selectedBrandId = params.get('brand') || '';
      this.sortBy = params.get('sort') || '';
      
      this.loadProducts();
    });
  }
  
  applyFilters(): void {
    this.filteredProducts = [...this.products];
    
  }


 
  fetchBrands(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (response) => {
        this.brands = response.data;
        this.updateVisibleBrands();
      },
      error: (error) => console.error('Error fetching brands:', error)
    });
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.updateVisibleCategories();
      },
      error: (error) => console.error('Error fetching categories:', error)
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
    
    if (this.searchTerm) queryParams['search'] = this.searchTerm;
    if (this.selectedCategoryId) queryParams['category[in]'] = this.selectedCategoryId;
    if (this.selectedBrandId) queryParams['brand'] = this.selectedBrandId;
    if (this.sortBy) queryParams['sort'] = this.sortBy;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '',
    });
  }

  onCategoryChange(event: any, categoryId: string): void {
    this.selectedCategoryId = event.target.checked ? categoryId : '';
    this.selectedBrandId = ''; // Reset brand when category changes
    this.searchTerm = ''; // Reset search when category changes
    this.updateQueryParams();
  }

  onBrandChange(event: any, brandId: string): void {
    this.selectedBrandId = event.target.checked ? brandId : '';
    this.selectedCategoryId = ''; // Reset category when brand changes
    this.searchTerm = ''; // Reset search when brand changes
    this.updateQueryParams();
  }

  onSortChange(event: any): void {
    this.sortBy = event.target.value;
    this.updateQueryParams();
  }
}