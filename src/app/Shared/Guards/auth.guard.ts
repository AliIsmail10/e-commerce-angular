// Old auth guard

// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
// import { AuthService } from '../Services/auth/auth.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot): boolean {
//     const user = this.authService.getUserData(); // Retrieve user details

//     if (user) {
//       const requiredRole = route.data['role']; // Get the required role from route config

//       if (!requiredRole || user.role === requiredRole) {
//         return true; // ✅ Allow access if no role is required or the role matches
//       } else {
//         this.router.navigate(['/home']); // 🔴 Redirect unauthorized users
//         return false;
//       }
//     } else {
//       this.router.navigate(['/login']); // 🔴 Redirect if not logged in
//       return false;
//     }
//   }
// }

// new auth guard
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  let _router = inject(Router);

  // Check if window and localStorage are available
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    if (localStorage.getItem('userToken') !== null) {
      return true;
    } else {
      localStorage.setItem('navigateTo', state.url);
      return _router.navigate(['/login']);
    }
  } else {
    // Handle the case where localStorage is not available
    return _router.navigate(['/login']);
  }
};
