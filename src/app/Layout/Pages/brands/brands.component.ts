import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandsService } from '../../../Shared/Services/brands/brands.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css'],
  imports: [CommonModule, RouterLink],
})
export class BrandsComponent implements OnInit {
  brands: any[] = [];

  constructor(private _BrandsService: BrandsService) {}

  ngOnInit(): void {
    this._BrandsService.getAllBrands().subscribe((response) => {
      this.brands = response.data;
    });
  }
}
