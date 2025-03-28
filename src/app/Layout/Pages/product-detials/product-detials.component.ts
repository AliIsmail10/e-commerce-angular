import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../Shared/Interfaces/product';
import { CartService } from '../../../Shared/Services/cart/cart.service';
import { ProductService } from '../../../Shared/Services/product/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detials',
  imports: [CarouselModule, RouterModule,CommonModule],
  templateUrl: './product-detials.component.html',
  styleUrl: './product-detials.component.css'
})
export class ProductDetialsComponent implements OnInit {
  productDetail:Product = {} as Product;
  isLoding: boolean = false
   constructor(private _ProductService:ProductService ,private _ActivatedRoute:ActivatedRoute ,private _CartService:CartService ,private  _toastr:ToastrService){}
  ngOnInit(): void {
   this._ActivatedRoute.paramMap.subscribe((res:any)=>{
      console.log(res.params.id);
      this._ProductService.getDetails(res.params.id).subscribe({
        next:(res)=>{
          console.log(res.data);
          this.productDetail=res.data;    

        },
        error:(err)=>{
          console.error(err);
        }  
      })
   })
  }
  getStarClass(index: number): string {
    if (!this.productDetail?.ratingsAverage) {
      return 'fa-star-o';
    }
  
    const fullStars = Math.floor(this.productDetail.ratingsAverage);
    const hasHalfStar = this.productDetail.ratingsAverage - fullStars >= 0.5;
  
    if (index < fullStars) {
      return 'fa-star'; 
    } else if (index === fullStars && hasHalfStar) {
      return 'fa-star-half-o'; 
    } else {
      return 'fa-star-o';
    }
  }
  

   addProductToCard(pId:string){
    this.isLoding=true
     this._CartService.AddProducttoCart(pId).subscribe({
       next: (res:any) => {
        console.log(res);
        this.isLoding=false
        this._toastr.success(res.message);
       },
       error: (error) => {
         console.error('Error adding product to cart: ', error);
         this.isLoding=false;
       }
     })
  }

  carouselOptions = {
    items:3,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    nav: true, 
    navText: [
      '<i class="fa fa-chevron-left fs-4"></i>',
      '<i class="fa fa-chevron-right fs-4"></i>' 
    ],
    dots: false,
    margin: 20,
 
  };


  
}
