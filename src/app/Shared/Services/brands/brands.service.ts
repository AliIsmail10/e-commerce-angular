import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enviroment } from '../../../base/enviroment';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  constructor(private _HttpClient:HttpClient) { }

  getAllBrands():Observable< any>{
    return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/brands`)
  }


  
GetSpecificBrand(bId:string):Observable<any>{
  return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/brands/${bId}`)
}
}
