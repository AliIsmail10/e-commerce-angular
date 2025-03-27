import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BrandsService } from '../../../Shared/Services/brands/brands.service';
import { CategoryService } from '../../../Shared/Services/category/category.service';
import { ProductService } from '../../../Shared/Services/product/product.service';
import { ProductCartComponent } from '../product-cart/product-cart.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ CommonModule,ProductCartComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  brands: any[] = [];
  categories: any[] = [];

  showMoreBrands = false;
  showMoreCategories = false;
  visibleBrands: any[] = [];   
  visibleCategories: any[] = [];

  constructor(
    private productService: ProductService,
    private brandsService: BrandsService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchBrands();
    this.fetchCategories();
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
}
