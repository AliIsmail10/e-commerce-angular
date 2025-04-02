import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [CommonModule, CarouselModule, RouterModule,TranslateModule],
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.css'],
})
export class HomeSliderComponent {
  carouselOptions = {
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    nav: true, 
    navText: [
      '<i class="fa fa-chevron-left fs-4"></i>', 
      '<i class="fa fa-chevron-right fs-4"></i>', 
    ],
    dots: false,
    responsive: {
      0: { items: 1 },
      768: { items: 1 },
      992: { items: 1 },
    },
   rtl: true

  };
}
