import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./Layout/Additions/navbar/navbar.component";
import { SecNavBarComponent } from "./Layout/Additions/sec-nav-bar/sec-nav-bar.component";
import { ThirdNavBarComponent } from "./Layout/Additions/third-nav-bar/third-nav-bar.component";
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FooterComponent } from "./Layout/Additions/footer/footer.component"; 
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SecNavBarComponent, ThirdNavBarComponent, CarouselModule, FooterComponent ,NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'E-commerceAngular';
  constructor(private spinner: NgxSpinnerService) {}

  
}