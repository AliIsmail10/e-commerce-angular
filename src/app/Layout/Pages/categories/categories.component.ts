import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../Shared/Services/category/category.service';
import { ProductService } from '../../../Shared/Services/product/product.service';

interface Category {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.errorMessage = '';

    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          'Failed to load categories. Please try again later.';
        console.error('Error loading categories:', error);
        this.loading = false;
      },
    });
  }

  viewCategory(categoryId: string) {
    this.loading = true;
    this.errorMessage = '';

    this.categoryService.GetSpecificCategory(categoryId).subscribe({
      next: (response) => {
        this.selectedCategory = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          'Failed to load category details. Please try again later.';
        console.error('Error fetching category:', error);
        this.loading = false;
      },
    });
  }

  viewProductsByCategory(categoryId: string) {
    this.router.navigate(['/products'], {
      queryParams: { 'category[in]': categoryId },
    });
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
}
