import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FilterPipe } from '../../../Shared/Pipe/filter.pipe';
import { BrandsService } from '../../../Shared/Services/brands/brands.service';
import { CategoryService } from '../../../Shared/Services/category/category.service';
import { ProductService } from '../../../Shared/Services/product/product.service';
import { SearchService } from '../../../Shared/Services/Search/search.service';
import { ProductCartComponent } from '../product-cart/product-cart.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCartComponent, FilterPipe],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
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
  searchTerm: string = '';
  sortBy: string = ''; // '' (default), 'price', or '-price'

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

    combineLatest([
      this.route.queryParamMap,
      this.searchService.currentSearchTerm,
    ])
      .pipe(
        switchMap(([params, searchTerm]) => {
          this.searchTerm = searchTerm;
          const categoryId = params.get('category[in]');
          const brandId = params.get('brand');
          const sort = params.get('sort') || this.sortBy; // Preserve sort from URL or component state

          this.selectedCategoryId = categoryId || '';
          this.selectedBrandId = brandId || '';
          this.sortBy = sort || '';

          this.loading = true;
          if (searchTerm) {
            return this.productService.searchProducts(searchTerm, this.sortBy);
          } else if (categoryId) {
            return this.productService.getProductsByCategory(
              categoryId,
              this.sortBy
            );
          } else if (brandId) {
            return this.productService.getProductsByBrand(brandId, this.sortBy);
          } else {
            return this.productService.getAllProducts(this.sortBy);
          }
        })
      )
      .subscribe({
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

  fetchBrands(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (response) => {
        this.brands = response.data;
        this.updateVisibleBrands();
      },
      error: (error) => console.error('Error fetching brands:', error),
    });
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.updateVisibleCategories();
      },
      error: (error) => console.error('Error fetching categories:', error),
    });
  }

  updateVisibleBrands(): void {
    this.visibleBrands = this.showMoreBrands
      ? this.brands
      : this.brands.slice(0, 5);
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

  updateQueryParams(): void {
    const queryParams: any = {};

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

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '',
    });
  }
}
