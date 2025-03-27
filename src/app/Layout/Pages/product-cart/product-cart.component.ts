import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../Shared/Services/product/product.service';

@Component({
  selector: 'app-product-cart',
  imports: [RouterLink,CommonModule],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css'
})
export class ProductCartComponent {
  @Input() product: any;


}
