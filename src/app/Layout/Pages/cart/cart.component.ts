import { Component, OnInit } from '@angular/core';
import { signal, computed } from '@angular/core';
import { CartService } from '../../../Shared/Services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart } from '../../../Shared/Interfaces/product';

@Component({
  selector: 'app-cart',
  imports: [CommonModule,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartItems = signal<any[]>([]); 
  cartId!: Cart;
  total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.count, 0)
  );

  constructor(
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
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

  updateQuantity(productId: string, eventOrQuantity: Event | number) {
    let newQuantity: number;
  
    if (typeof eventOrQuantity === 'number') {
      newQuantity = eventOrQuantity; 
    } else {
      const inputElement = (eventOrQuantity.target as HTMLInputElement);
      newQuantity = parseInt(inputElement.value, 10); 
    }
  
    if (newQuantity < 1) return; 
  
    this.cartService
      .UpdateCartProductQuantity(productId, newQuantity)
      .subscribe({
        next: () => {
          console.log('Cart updated');
          this.loadCartItems();
        },
        error: (err) => {
          console.error('Failed to update quantity:', err);
        },
      });
  }
  
  removeItem(productId: string) {
    this.cartService.RemoveSpecificCartItem(productId).subscribe({
      next: () => {
        this.toastr.error('Item removed');
        this.loadCartItems();
      },
      error: () => this.toastr.error('Failed to remove item'),
    });
  }

  clearCart() {
    this.cartService.ClearUserCart().subscribe({
      next: () => {
        this.cartItems.set([]);
        this.toastr.warning('Cart cleared');
      },
      error: () => this.toastr.error('Failed to clear cart'),
    });
  }
}
