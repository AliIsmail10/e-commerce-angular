import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../Shared/Services/auth/auth.service';
import jQuery from 'jquery';
import { TranslationService } from '../../../Shared/Services/translation/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule,TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit  {
  userName: string = '';
  islogging: boolean = false;

  constructor(private authService: AuthService , private _TranslationService:TranslationService) {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.islogging = isLoggedIn;
    });
  }

  ngOnInit(): void {
    this.authService.userData.subscribe((user) => {
      if (user) {
        this.userName = user.name;
      }
    });
  }

  logout() {
    console.log('Logout button clicked!');
    this.authService.logout();
  }

  changeLanguage(language: string) {
    this._TranslationService.changeLanguage(language);;
    jQuery('.lang-dropdown').removeClass('show');
    jQuery('.lang-dropdown').find('.dropdown-menu').removeClass('show');
  }
 
}
