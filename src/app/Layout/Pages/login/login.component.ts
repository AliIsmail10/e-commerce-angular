import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Shared/Services/auth/auth.service';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    this.authService
      .sentLogin({
        email: this.loginForm.controls['email'].value,
        password: this.loginForm.controls['password'].value,
      })
      .subscribe(
        (response) => {
          console.log('Login successful:', response);
          this.errorMessage = '';

          localStorage.setItem('userToken', response.token);

          this.authService.deCodeUserData();

          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Login failed:', error);
          this.errorMessage =
            error.error?.message || 'Invalid email or password';
        }
      );
  }
}
