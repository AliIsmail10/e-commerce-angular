import { Routes } from '@angular/router';
import { HomeComponent } from './Layout/Pages/home/home.component';
import { NotFoundComponent } from './Layout/Additions/not-found/not-found.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'brands', loadComponent: () => import('./Layout/Pages/brands/brands.component').then(m => m.BrandsComponent) },
    { path: 'products', loadComponent: () => import('./Layout/Pages/products/products.component').then(m => m.ProductsComponent) },
    { path: 'about', loadComponent: () => import('./Layout/Pages/about/about.component').then(m => m.AboutComponent) },
    { path: 'contact', loadComponent: () => import('./Layout/Pages/contact/contact.component').then(m => m.ContactComponent) },
    { path: 'cart', loadComponent: () => import('./Layout/Pages/cart/cart.component').then(m => m.CartComponent) },
    { path: 'categorires', loadComponent: () => import('./Layout/Pages/categories/categories.component').then(m => m.CategoriesComponent) },
    { path: 'brandDeatils/:id', loadComponent: () => import('./Layout/Pages/details-brand/details-brand.component').then(m => m.DetailsBrandComponent) },
    { path: 'productDetails/:id', loadComponent: () => import('./Layout/Pages/product-detials/product-detials.component').then(m => m.ProductDetialsComponent) },
    { path: 'categoryDetails/:id', loadComponent: () => import('./Layout/Pages/specific-category/specific-category.component').then(m => m.SpecificCategoryComponent) },
    { path: 'login', loadComponent: () => import('./Layout/Pages/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./Layout/Pages/register/register.component').then(m => m.RegisterComponent) },
    { path: '**', component:NotFoundComponent }
];
