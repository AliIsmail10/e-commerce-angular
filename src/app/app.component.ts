import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./Layout/Additions/navbar/navbar.component";
import { SecNavBarComponent } from "./Layout/Additions/sec-nav-bar/sec-nav-bar.component";
import { ThirdNavBarComponent } from "./Layout/Additions/third-nav-bar/third-nav-bar.component";
import jQuery from 'jquery';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FooterComponent } from "./Layout/Additions/footer/footer.component"; 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SecNavBarComponent, ThirdNavBarComponent, CarouselModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'E-commerceAngular';
  ngAfterViewInit() {
    // Dropdown toggles
    jQuery('.ht-setting-trigger').on('click', function() {
      jQuery(this).siblings('.ht-setting').toggle();
    });

    jQuery('.ht-currency-trigger').on('click', function() {
      jQuery(this).siblings('.ht-currency').toggle();
    });

    jQuery('.ht-language-trigger').on('click', function() {
      jQuery(this).siblings('.ht-language').toggle();
    });

    jQuery(document).on('click', function(event) {
      if (!jQuery(event.target).closest('.ht-menu > li').length) {
        jQuery('.ht-setting, .ht-currency, .ht-language').hide();
      }
    });
  }
}