import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Enviroment } from '../../../base/enviroment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private userToken: any;
  private wishlistCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public wishlistCount$: Observable<number> = this.wishlistCountSubject.asObservable();

  constructor(private _HttpClient: HttpClient) {
    if (typeof localStorage !== 'undefined') {
      this.userToken = { "token": localStorage.getItem('userToken') };
      this.loadWishlistCount();  // Load initial count
    }
  }

  private loadWishlistCount() {
    this.GetLoggedUserWishlist().subscribe({
      next: (wishList) => {
        this.wishlistCountSubject.next(wishList.count);
      }
    });
  }

  AddProductToWishlist(pId: string): Observable<any> {
    return this._HttpClient.post(`${Enviroment.baseUrl}/api/v1/wishlist`,
      { "productId": pId },
      { headers: this.userToken }

    ).pipe(tap(() => {
      this.wishlistCountSubject.next(this.wishlistCountSubject.getValue() + 1);
    }));
  }

  RemoveProductFromWishlist(pId: string): Observable<any> {
    return this._HttpClient.delete(`${Enviroment.baseUrl}/api/v1/wishlist/${pId}`,
      { headers: this.userToken }
    ).pipe(tap(() => {
      this.wishlistCountSubject.next(this.wishlistCountSubject.getValue() - 1);
    }));
  }

  GetLoggedUserWishlist(): Observable<any> {
    return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/wishlist` );
  }}
