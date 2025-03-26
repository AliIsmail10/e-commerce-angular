import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Enviroment } from '../../../base/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private _HttpClient: HttpClient) { }

  cartItem:BehaviorSubject <number>= new BehaviorSubject(0)

  AddProducttoCart(pId: string): Observable<any> {
    return this._HttpClient.post(`${Enviroment.baseUrl}/api/v1/cart`, {
      "productId": pId
    });
  }

  UpdateCartProductQuantity(pId: string, Pcount: number): Observable<any> {
    return this._HttpClient.put(`${Enviroment.baseUrl}/api/v1/cart/${pId}`, {
      "count": Pcount
    });
  }

  GetLoggedUserCart(): Observable<any> {
    return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/cart`);
  }

  RemoveSpecificCartItem(pId: string): Observable<any> {
    return this._HttpClient.delete(`${Enviroment.baseUrl}/api/v1/cart/${pId}`);
  }

  ClearUserCart(): Observable<any> {
    return this._HttpClient.delete(`${Enviroment.baseUrl}/api/v1/cart`);
  }
}
