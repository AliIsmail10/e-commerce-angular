import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Enviroment } from '../../../base/enviroment';
import { LoginData, UserData } from '../../Interfaces/user-data';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { toObservable } from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: BehaviorSubject<any> = new BehaviorSubject(null);
  private _isLoggedIn = signal<boolean>(false);

  isLoggedIn = this._isLoggedIn.asReadonly();

  isLoggedIn$ = toObservable(this._isLoggedIn);

  constructor(private _HttpClient: HttpClient, private _Router: Router) {
    this.checkToken();
  }

  private checkToken() {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        this.userData.next(decodedUser);
        this._isLoggedIn.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }
  logout() {
    localStorage.removeItem('userToken');
    this.userData.next(null);
    this._isLoggedIn.set(false);
    this._Router.navigate(['/login']);
  }

  sentRegister(userData: UserData): Observable<any> {
    return this._HttpClient.post(
      `${Enviroment.baseUrl}/api/v1/auth/signup`,
      userData
    );
  }

  sentLogin(userData: LoginData): Observable<any> {
    return this._HttpClient.post(
      `${Enviroment.baseUrl}/api/v1/auth/signin`,
      userData
    );
  }

  deCodeUserData(token: string) {
    try {
      const decodedUser = jwtDecode(token);
      this.userData.next(decodedUser);
      this._isLoggedIn.set(true);
    } catch (error) {
      this.logout();
    }
  }

  getUserData() {
    const user =
      this.userData.value ||
      JSON.parse(localStorage.getItem('userData') || 'null');
    return user && Object.keys(user).length ? user : null;
  }
}
