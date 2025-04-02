import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { Cart, Product } from '../../../Shared/Interfaces/product';
import { CartService } from '../../../Shared/Services/cart/cart.service';
import { ProductService } from '../../../Shared/Services/product/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detials',
  standalone: true,
  imports: [CarouselModule, RouterModule, CommonModule],
  templateUrl: './product-detials.component.html',
  styleUrls: ['./product-detials.component.css']
})
export class ProductDetialsComponent implements OnInit {
  productDetail: Product = {} as Product;
  isLoading: boolean = false;
  quantity: number = 1;
  cart = signal<Cart | null>(null);

  constructor(
    private toastr: ToastrService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: any) => {
      const productId = params.params.id;
      this.productService.getDetails(productId).subscribe({
        next: (res) => {
          this.productDetail = res.data;
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to load product details');
        }
      });
    });

    
  }

  incrementQuantity(): void {
    if (this.quantity < this.productDetail.quantity) {
      this.quantity++;
      this.toastr.success('Product quantity increased');
    } else {
      this.toastr.warning(`Maximum available quantity is ${this.productDetail.quantity}`);
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
    if(this.quantity ==1) {
      this.toastr.warning('Minimum quantity is 1');
    }
  }

  addProductToCard(productId: string): void {
    this.isLoading = true;
    
    const cart = this.cart();
    const existingProduct = cart?.data?.products?.find(p => p.product._id === productId);

    if (existingProduct) {
      this.updateProductQuantity(productId, this.quantity); 
      this.toastr.success('Product quantity updated in cart')
    } else {
      this.addNewProductToCart(productId, this.quantity);
    }
  }

  private updateProductQuantity(productId: string, quantity: number): void {
    this.cartService.UpdateCartProductQuantity(productId, quantity).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success('Product quantity updated in cart');
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error('Failed to update product quantity');
      }
    });
  }

  private addNewProductToCart(productId: string, quantity: number): void {
    this.cartService.AddProducttoCart(productId).subscribe({
      next: (res) => {
        this.updateProductQuantity(productId, quantity);
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error('Failed to add product to cart');
      }
    });
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

  carouselOptions: OwlOptions = {
    items: 3,
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
   rtl: true
  };
  
}