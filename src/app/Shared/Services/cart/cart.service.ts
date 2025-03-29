import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { Enviroment } from '../../../base/enviroment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartCountSubject = new BehaviorSubject<number>(0);
  public CartCount$ = this.cartCountSubject.asObservable();
  private cartUpdates = new Subject<void>();
cartUpdates$ = this.cartUpdates.asObservable();


notifyCartUpdates() {
  this.cartUpdates.next();
}
  constructor(private _HttpClient: HttpClient , private _AuthService: AuthService) {

    this._AuthService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadInitialCartCount();
      } else {
        this.cartCountSubject.next(0);
      }
    });
  }

  private loadInitialCartCount() {
    this.GetLoggedUserCart().subscribe({
      next: (cart) => {
        this.cartCountSubject.next(cart.numOfCartItems || 0);
      },
      error: () => this.cartCountSubject.next(0)
    });
  }



 // Example in CartService
AddProducttoCart(pId: string): Observable<any> {
  return this._HttpClient.post(`${Enviroment.baseUrl}/api/v1/cart`, { "productId": pId }).pipe(
    tap((response: any) => {
      this.cartCountSubject.next(response.numOfCartItems);
      this.notifyCartUpdates();
    })
  );
}
  UpdateCartProductQuantity(pId: string, Pcount: number): Observable<any> {
    return this._HttpClient.put(`${Enviroment.baseUrl}/api/v1/cart/${pId}`, { "count": Pcount });
  }

  GetLoggedUserCart(): Observable<any> {
    return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/cart`);
  }

  RemoveSpecificCartItem(pId: string): Observable<any> {
    return this._HttpClient.delete(`${Enviroment.baseUrl}/api/v1/cart/${pId}`).pipe(
      tap((response: any) => {
        this.cartCountSubject.next(response.numOfCartItems);
      })
    );
  }

  ClearUserCart(): Observable<any> {
    return this._HttpClient.delete(`${Enviroment.baseUrl}/api/v1/cart`).pipe(
      tap((response: any) => {
        this.cartCountSubject.next(response.numOfCartItems);
      })
    );
  }
}
