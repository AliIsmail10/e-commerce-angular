import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { BrandsService } from '../../../Shared/Services/brands/brands.service';
import { CategoryService } from '../../../Shared/Services/category/category.service';
import { ProductService } from '../../../Shared/Services/product/product.service';
import { ProductCartComponent } from '../product-cart/product-cart.component';
import { SearchService } from '../../../Shared/Services/Search/search.service';
import { Product } from '../../../Shared/Interfaces/product';
import { FilterPipe } from '../../../Shared/Pipe/filter.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCartComponent,FilterPipe],
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

  constructor(
    private productService: ProductService,
    private brandsService: BrandsService,
    private categoryService: CategoryService,
    private route: ActivatedRoute, // Keep ActivatedRoute for accessing route params
    private router: Router, // Correctly inject Router for navigating
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    // Check for category or brand in query params and fetch filtered products
    if (
      !this.route.snapshot.queryParamMap.has('category[in]') &&
      !this.route.snapshot.queryParamMap.has('brand')
    ) {
      this.fetchProducts(); // Fetch all products if no filter
    }
    this.fetchBrands();
    this.fetchCategories();
    this.getProductsByCategory(); // Fetch products by category if applicable
    this.getProductsByBrand(); // Fetch products by brand if applicable

    this.searchService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
    });
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

    // Update query param for category
    this.updateQueryParams();

    // Fetch filtered products based on selected category
    this.getProductsByCategory();
  }

  onBrandChange(event: any, brandId: string): void {
    if (event.target.checked) {
      this.selectedBrandId = brandId; // Set the selected brand ID
    } else {
      this.selectedBrandId = ''; // Clear the selected brand ID if unchecked
    }

    // Update query param for brand
    this.updateQueryParams();

    // Fetch products based on selected brand
    this.getProductsByBrand();
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

  getProductsByCategory(): void {
    const categoryId = this.route.snapshot.queryParamMap.get('category[in]');
    const decodedCategoryId = categoryId
      ? decodeURIComponent(categoryId)
      : this.selectedCategoryId; // Use selected category if available

    if (decodedCategoryId) {
      this.loading = true;
      this.productService.getProductsByCategory(decodedCategoryId).subscribe({
        next: (response) => {
          this.products = response.data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching products by category:', error);
          this.loading = false;
        },
      });
    }
  }

  getProductsByBrand(): void {
    const brandId = this.route.snapshot.queryParamMap.get('brand');
    const decodedBrandId = brandId
      ? decodeURIComponent(brandId)
      : this.selectedBrandId; // Use selected brand if available

    if (decodedBrandId) {
      this.loading = true;
      this.productService.getProductsByBrand(decodedBrandId).subscribe({
        next: (response) => {
          this.products = response.data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching products by brand:', error);
          this.loading = false;
        },
      });
    }
  }

  
}
