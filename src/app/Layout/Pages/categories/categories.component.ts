import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../Shared/Services/category/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  imports: [CommonModule, RouterLink],
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  selectedCategory: any = null;
  loading: boolean = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      },
    });
  }

  viewCategory(categoryId: string) {
    this.loading = true;
    this.categoryService.GetSpecificCategory(categoryId).subscribe({
      next: (response) => {
        this.selectedCategory = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching category:', error);
        this.loading = false;
      },
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
