import { Routes } from '@angular/router';
import { NotFoundComponent } from './Layout/Additions/not-found/not-found.component';
import { HomeComponent } from './Layout/Pages/home/home.component';
import { ProductsComponent } from './Layout/Pages/products/products.component';
import { AuthGuard } from './Shared/Guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'brands',
    loadComponent: () =>
      import('./Layout/Pages/brands/brands.component').then(
        (m) => m.BrandsComponent
      ),
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./Layout/Pages/wish-list/wish-list.component').then(
        (m) => m.WishListComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./Layout/Pages/about/about.component').then(
        (m) => m.AboutComponent
      ),
  },
  {
    path: 'order',
    loadComponent: () =>
      import('./Layout/Pages/order/order.component').then(
        (m) => m.OrderComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'contact',
    loadComponent: () =>
      import('./Layout/Pages/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
  },
  {
    path: 'allorders',
    loadComponent: () =>
      import('./Layout/Pages/cart/cart.component').then((m) => m.CartComponent),
    canActivate: [AuthGuard],
    data: { role: 'user' },
  },
  {
    path: 'checkout/:Cid',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./Layout/Additions/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./Layout/Pages/categories/categories.component').then(
        (m) => m.CategoriesComponent
      ),
  },

  {
    path: 'productDetails/:id',
    loadComponent: () =>
      import('./Layout/Pages/product-detials/product-detials.component').then(
        (m) => m.ProductDetialsComponent
      ),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./Layout/Pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./Layout/Pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  { path: '**', component: NotFoundComponent },
];
