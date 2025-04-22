import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enviroment } from '../../../base/enviroment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChectoutService {

  constructor(private _HttpClient:HttpClient ,private router:Router) { }


  CreateCashOrder(cId:string ,userData:any):Observable<any>{
    
    return this._HttpClient.post(`${Enviroment.baseUrl}/api/v1/orders/checkout-session/${cId}?url=${Enviroment.localUrl}`,
      {
        "shippingAddress":userData
    }
    )}
}
