import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product-area',
  standalone: true, 
  imports: [CommonModule, CarouselModule], 
  templateUrl: './product-area.component.html',
  styleUrl: './product-area.component.css'
})
export class ProductAreaComponent {
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
    responsive: {
      0: { items: 1 }, 
      768: { items: 2 }, 
      992: { items: 3 } 
    }
  };
}