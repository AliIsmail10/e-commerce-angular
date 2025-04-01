import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
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
  selectedBrandId: string = ''; // Added for single brand selection

  constructor(
    private productService: ProductService,
    private brandsService: BrandsService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (
      !this.route.snapshot.queryParamMap.has('category[in]') &&
      !this.route.snapshot.queryParamMap.has('brand')
    ) {
      this.fetchProducts();
    }
    this.fetchBrands();
    this.fetchCategories();
    this.getProductsByCategory(); // Fetch products by category if applicable
    this.getProductsByBrand(); // Fetch products by brand if applicable
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
      this.selectedCategoryId = categoryId;
    } else {
      this.selectedCategoryId = '';
    }
    this.getProductsByCategory();
  }

  onBrandChange(event: any, brandId: string): void {
    if (event.target.checked) {
      this.selectedBrandId = brandId; // Set the selected brand ID
    } else {
      this.selectedBrandId = ''; // Clear the selected brand ID if unchecked
    }
    this.getProductsByBrand(); // Fetch products by the selected brand
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

  getProductsByCategory(): void {
    if (this.selectedCategoryId) {
      this.productService
        .getProductsByCategory(this.selectedCategoryId)
        .subscribe({
          next: (response) => {
            this.products = response.data;
          },
          error: (error) => {
            console.error('Error fetching products by category:', error);
          },
        });
    }
  }

  getProductsByBrand(): void {
    if (this.selectedBrandId) {
      this.productService.getProductsByBrand(this.selectedBrandId).subscribe({
        next: (response) => {
          this.products = response.data;
        },
        error: (error) => {
          console.error('Error fetching products by brand:', error);
        },
      });
    }
  }
}
