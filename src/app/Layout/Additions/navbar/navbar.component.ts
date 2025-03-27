import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../Shared/Services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  userName: string = '';

  constructor(private authService: AuthService) {}

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
}
