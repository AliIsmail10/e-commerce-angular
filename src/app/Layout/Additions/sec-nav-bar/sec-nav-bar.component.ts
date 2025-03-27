import { AfterViewInit, Component } from '@angular/core';
import jQuery from 'jquery';

@Component({
  selector: 'app-sec-nav-bar',
  imports: [],
  templateUrl: './sec-nav-bar.component.html',
  styleUrl: './sec-nav-bar.component.css'
})
export class SecNavBarComponent implements AfterViewInit{
  ngAfterViewInit(): void {
   
    jQuery('.ht-setting-trigger, .ht-currency-trigger, .ht-language-trigger, .hm-minicart-trigger, .cw-sub-menu').on('click', function (e) {
      e.preventDefault();
      $(this).toggleClass('is-active');
      $(this).siblings('.ht-setting, .ht-currency, .ht-language, .minicart, .cw-sub-menu li').slideToggle();
    });
    $('.ht-setting-trigger.is-active').siblings('.catmenu-body').slideDown();
  
  }
   
}
