import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enviroment } from '../../../base/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _HttpClient: HttpClient) {}

  // Generic method to get products with optional filters and sorting
  getProducts(
    filters: { [key: string]: string } = {},
    sort?: string
  ): Observable<any> {
    let params = new HttpParams();

    // Apply filters (e.g., category, brand, search term)
    for (const key in filters) {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    }

    // Apply sorting if provided
    if (sort) {
      params = params.set('sort', sort); // e.g., 'price' or '-price'
    }

    return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/products`, {
      params,
    });
  }

  getAllProducts(sort?: string): Observable<any> {
    return this.getProducts({}, sort);
  }

  searchProducts(query: string, sort?: string): Observable<any> {
    return this.getProducts({ title: query }, sort);
  }

  getDetails(pId: string): Observable<any> {
    return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/products/${pId}`);
  }

  getProductsByCategory(categoryId: string, sort?: string): Observable<any> {
    return this.getProducts({ 'category[in]': categoryId }, sort);
  }

  getProductsByBrand(brandId: string, sort?: string): Observable<any> {
    return this.getProducts({ brand: brandId }, sort);
  }
}
