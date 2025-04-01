import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enviroment } from '../../../base/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _HttpClient: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/products`);
  }

  getDetails(pId: string): Observable<any> {
    return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/products/${pId}`);
  }

  getProductsByCategory(categoryId: string): Observable<any> {
    const params = new HttpParams().set('category[in]', categoryId);
    return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/products`, {
      params,
    });
  }
  getProductsByBrand(brandId: string): Observable<any> {
    const params = new HttpParams().set('brand', brandId);
    return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/products`, {
      params,
    });
  }
}
