import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ProductCartComponent } from '../../Pages/product-cart/product-cart.component';
import { ProductService } from '../../../Shared/Services/product/product.service';

@Component({
  selector: 'app-product-area',
  standalone: true, 
  imports: [CommonModule, CarouselModule ,ProductCartComponent], 
  templateUrl: './product-area.component.html',
  styleUrl: './product-area.component.css'
})
export class ProductAreaComponent implements OnInit {
  @Input() products: any[] = [];

  carouselOptions = {
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
    responsive: {
      0: { items: 1 }, 
      768: { items: 2 }, 
      992: { items: 3 } 
    }
  };
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    if (this.products.length === 0) {
      this.fetchProducts();
    }
  }

  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        this.products = response.data;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }
}