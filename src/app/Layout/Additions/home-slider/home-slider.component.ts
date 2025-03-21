import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.css']
})
export class HomeSliderComponent {
  carouselOptions = {
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    nav: true, // Enable navigation buttons
    navText: [
      '<i class="fa fa-chevron-left fs-4"></i>', // Custom left arrow
      '<i class="fa fa-chevron-right fs-4"></i>' // Custom right arrow
    ],
    dots: false,
    responsive: {
      0: { items: 1 },
      768: { items: 1 },
      992: { items: 1 }
    }
  };
}