// wishlist.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { Enviroment } from '../../../base/enviroment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistCountSubject = new BehaviorSubject<number>(0);
  public wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor(
    private _HttpClient: HttpClient,
    private _AuthService: AuthService
  ) {
    this._AuthService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadWishlistCount();
      } else {
        this.wishlistCountSubject.next(0);
      }
    });
  }

 
private loadWishlistCount(): void {
  this.GetLoggedUserWishlist().pipe(
    catchError(() => of({ count: 0, data: [] as any[] }))
  ).subscribe({
    next: (wishList: { count?: number; data?: any[] }) => {
      this.wishlistCountSubject.next(wishList.count || wishList.data?.length || 0);
    },
    error: (err: Error) => {
      console.error('Error loading wishlist count:', err);
    }
  });
}
  AddProductToWishlist(pId: string): Observable<any> {
    return this._HttpClient.post(`${Enviroment.baseUrl}/api/v1/wishlist`, {
      productId: pId
    }).pipe(
      tap(() => {
        this.wishlistCountSubject.next(this.wishlistCountSubject.value + 1);
      })
    );
  }

  RemoveProductFromWishlist(pId: string): Observable<any> {
    return this._HttpClient.delete(`${Enviroment.baseUrl}/api/v1/wishlist/${pId}`)
      .pipe(
        tap(() => {
          this.wishlistCountSubject.next(Math.max(0, this.wishlistCountSubject.value - 1));
        })
      );
  }

  GetLoggedUserWishlist(): Observable<any> {
    return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/wishlist`);
  }
}