import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-third-nav-bar',
  imports: [RouterLink ,RouterLinkActive,TranslateModule],
  templateUrl: './third-nav-bar.component.html',
  styleUrl: './third-nav-bar.component.css'
})
export class ThirdNavBarComponent {

  
}
