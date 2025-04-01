import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Enviroment } from '../../../base/enviroment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private _HttpClient:HttpClient,private _AuthService:AuthService) { 


    this._AuthService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {

      } else {
     
     
      }
    })
  }
  getAllOrders(): Observable<any> {
   return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/orders`);
  }
}
