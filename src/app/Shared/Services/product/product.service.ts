import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enviroment } from '../../../base/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _HttpClient: HttpClient) {}

  getProducts(filters: { [key: string]: string } = {}, sort?: string): Observable<any> {
    let params = new HttpParams();
    
    for (const key in filters) {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    
    if (sort) {
      params = params.set('sort', sort);
    }

    return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/products`, { params });
  }

  getAllProducts(sort?: string): Observable<any> {
    return this.getProducts({}, sort);
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

  searchProducts(searchTerm: string, sort?: string): Observable<any> {
    return this.getProducts({ keyword: searchTerm }, sort);
  }
}