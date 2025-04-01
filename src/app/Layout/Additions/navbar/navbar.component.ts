import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../Shared/Services/auth/auth.service';
import jQuery from 'jquery';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit ,AfterViewInit {
  userName: string = '';
  islogging: boolean = false;

  constructor(private authService: AuthService) {
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

  ngAfterViewInit() {

  }
}
