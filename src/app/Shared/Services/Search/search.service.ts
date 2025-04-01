import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSource = new BehaviorSubject<string>('');
  private categorySource = new BehaviorSubject<string>('');

  currentSearchTerm = this.searchTermSource.asObservable();
  currentCategory = this.categorySource.asObservable();

  updateSearchTerm(term: string) {
    this.searchTermSource.next(term);
  }

  updateCategory(categoryId: string) {
    this.categorySource.next(categoryId);
  }

  clearFilters() {
    this.searchTermSource.next('');
    this.categorySource.next('');
  }
}