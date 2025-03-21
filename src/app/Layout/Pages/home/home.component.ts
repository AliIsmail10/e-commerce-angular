import { Component } from '@angular/core';
import { HomeSliderComponent } from "../../Additions/home-slider/home-slider.component";
import { ProductAreaComponent } from '../../Additions/product-area/product-area.component';

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [HomeSliderComponent,ProductAreaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
