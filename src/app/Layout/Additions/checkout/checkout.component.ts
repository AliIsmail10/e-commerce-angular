import { Component, computed, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChectoutService } from '../../../Shared/Services/checkout/chectout.service';
import { CartService } from '../../../Shared/Services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartId: string = '';
  cartItems = signal<any[]>([]);
  total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.count, 0)
  );

  isLoading: boolean = false;
  showErrorMessage: boolean = false; 

  constructor(
    private toastr: ToastrService,
    private _CheckoutService: ChectoutService,
    private _ActivatedRoute: ActivatedRoute,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((res: any) => {
      this.cartId = res.params.Cid;
    });
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartService.GetLoggedUserCart().subscribe({
      next: (response) => {
        this.cartItems.set(response.data.products);
        
        this.cartId = response.data._id;
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
      },
    });
  }

  cartFrom: FormGroup = new FormGroup({
    details: new FormControl(null, [Validators.required]),
    city: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/),
    ]),
  });

  payment() {
    if (this.cartFrom.invalid) {
      this.cartFrom.markAllAsTouched();
      this.showErrorMessage = true;
      this.toastr.error('Please fill all required fields correctly.', 'Invalid Form');
      return;
    }

    this.showErrorMessage = false; 
    this.isLoading = true;
    this._CheckoutService.CreateCashOrder(this.cartId, this.cartFrom.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        window.open(res.session.url, '_self');
      },
      error: (err: any) => {
        
        this.isLoading = false;
        this.showErrorMessage = true; 
        this.toastr.error('Payment failed. Please try again.', 'Error');
      },
    });
  }
}
