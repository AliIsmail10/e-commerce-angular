// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-cart',
// //   imports: [],
// //   templateUrl: './cart.component.html',
// //   styleUrl: './cart.component.css'
// // })
// // export class CartComponent {

// // }

// import { Component, OnInit } from '@angular/core';
// import { CartService } from '../../../Shared/Services/cart/cart.service';
// import { ToastrService } from 'ngx-toastr';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-cart',
//   imports: [CommonModule],
//   templateUrl: './cart.component.html',
//   styleUrl: './cart.component.css',
// })
// export class CartComponent implements OnInit {
//   cartItems: any[] = [];
//   total: number = 0;

//   constructor(
//     private cartService: CartService,
//     private toastr: ToastrService
//   ) {}

//   ngOnInit(): void {
//     this.loadCartItems();
//   }

//   loadCartItems() {
//     this.cartService.GetLoggedUserCart().subscribe({
//       next: (response) => {
//         this.cartItems = response.data.products;
//         this.calculateTotal();
//       },
//       error: (err) => {
//         console.error('Error fetching cart:', err);
//       },
//     });
//   }

//   calculateTotal() {
//     this.total = this.cartItems.reduce(
//       (sum, item) => sum + item.price * item.count,
//       0
//     );
//   }

//   updateQuantity(productId: string, event: Event) {
//     const inputElement = event.target as HTMLInputElement;
//     const newQuantity = parseInt(inputElement.value, 10);

//     if (!isNaN(newQuantity) && newQuantity > 0) {
//       this.cartService
//         .UpdateCartProductQuantity(productId, newQuantity)
//         .subscribe({
//           next: (response) => {
//             console.log('Cart updated:', response);
//           },
//           error: (err) => {
//             console.error('Failed to update quantity:', err);
//           },
//         });
//     } else {
//       console.warn('Invalid quantity entered');
//     }
//   }

//   removeItem(productId: string) {
//     this.cartService.RemoveSpecificCartItem(productId).subscribe({
//       next: () => {
//         this.toastr.error('Item removed');
//         this.loadCartItems();
//       },
//       error: () => this.toastr.error('Failed to remove item'),
//     });
//   }

//   clearCart() {
//     this.cartService.ClearUserCart().subscribe({
//       next: () => {
//         this.cartItems = [];
//         this.total = 0;
//         this.toastr.warning('Cart cleared');
//       },
//       error: () => this.toastr.error('Failed to clear cart'),
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { signal, computed } from '@angular/core';
import { CartService } from '../../../Shared/Services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartItems = signal<any[]>([]); 
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
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
      },
    });
  }

  updateQuantity(productId: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = parseInt(inputElement.value, 10);

    if (!isNaN(newQuantity) && newQuantity > 0) {
      this.cartService
        .UpdateCartProductQuantity(productId, newQuantity)
        .subscribe({
          next: (response) => {
            console.log('Cart updated:', response);
            this.loadCartItems();
          },
          error: (err) => {
            console.error('Failed to update quantity:', err);
          },
        });
    } else {
      console.warn('Invalid quantity entered');
    }
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
