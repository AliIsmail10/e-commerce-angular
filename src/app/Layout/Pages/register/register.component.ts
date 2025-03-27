import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Shared/Services/auth/auth.service';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup(
      {
        name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phone: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^01[0-9]{9}$/), // Egyptian phone number pattern
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        rePassword: new FormControl(null, [Validators.required]),
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('password')?.value;
    const rePassword = formGroup.get('rePassword')?.value;
    return password === rePassword ? null : { mustMatch: true };
  };

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.authService.sentRegister(this.registerForm.value).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        this.errorMessage = '';

        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed:', error);
        this.errorMessage =
          error.error?.message || 'Registration failed. Please try again.';
      }
    );
  }
}
