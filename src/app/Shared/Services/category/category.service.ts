import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enviroment } from '../../../base/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _HttpClient:HttpClient) { }

  getAllCategories():Observable< any>{
    return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/categories`)
  }


  GetSpecificCategory(categoryId:string):Observable <any>{
     return this._HttpClient.get(`${Enviroment.baseUrl}/api/v1/categories/${categoryId}`)
  }
}
