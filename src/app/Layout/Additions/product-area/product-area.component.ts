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
    items: 3, // Default number of items per slide
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    nav: true, // Enable navigation buttons
    navText: [
      '<i class="fa fa-chevron-left fs-4"></i>', // Custom left arrow
      '<i class="fa fa-chevron-right fs-4"></i>' // Custom right arrow
    ],
    dots: false, // Disable dots (optional)
    responsive: {
      0: { items: 1 }, // 1 item on small screens
      768: { items: 2 }, // 2 items on medium screens
      992: { items: 3 } // 3 items on large screens
    }
  };
}