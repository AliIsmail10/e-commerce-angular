import { Component, computed, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChectoutService } from '../../../Shared/Services/checkout/chectout.service';
import { CartService } from '../../../Shared/Services/cart/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [RouterModule,ReactiveFormsModule ,CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  cartId:string=""
  cartItems = signal<any[]>([]); 
  total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.count, 0)
  );

  isLoading:boolean=false
  constructor(private router:Router,private _CheckoutService:ChectoutService , private _ActivatedRoute:ActivatedRoute ,private cartService:CartService){}
 


  ngOnInit(): void {
      this._ActivatedRoute.paramMap.subscribe((res:any)=>{
        this.cartId=res.params.Cid;         
      })
      this.loadCartItems();
  }

  loadCartItems() {
    this.cartService.GetLoggedUserCart().subscribe({
      next: (response) => {
        this.cartItems.set(response.data.products); 
        console.log("response.data.products ",response.data.products);
       this.cartItems.set(response.data.products);
        this.cartId = response.data._id;
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
      },
    });
  }

  cartFrom:FormGroup=new FormGroup({
    details:new FormControl(null,[Validators.required]),
    city:new FormControl(null,[Validators.required]),
    phone:new FormControl(null,[Validators.required,Validators.pattern(/^01[0125][0-9]{8}$/)])
  })

  payment() {
    if (this.cartFrom.invalid) {
      this.cartFrom.markAllAsTouched(); 
      return;
    }
  
    this.isLoading = true;
    this._CheckoutService.CreateCashOrder(this.cartId, this.cartFrom.value).subscribe({
      next: (res: any) => {
        window.open(res.session.url, "_self");
      },
      error: (err: any) => {
        console.log("payment failed", err);
        this.isLoading = false;
      },
    });
  }
  

}
