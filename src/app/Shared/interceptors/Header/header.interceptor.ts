import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../Services/auth/auth.service';
import { inject } from '@angular/core';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  if (authService.isLoggedIn()) {
    const token = localStorage.getItem('userToken');
    if (token) {
      req = req.clone({
        setHeaders: { 
          'token': token,
          'Content-Type': 'application/json'
        }
      });
    }
  }

  return next(req);
};
