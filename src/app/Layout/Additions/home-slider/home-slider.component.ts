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
    nav: false,
    dots: false,
    responsive: {
      0: { items: 1 },
      768: { items: 1 },
      992: { items: 1 }
    }
  };
}