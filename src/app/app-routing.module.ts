import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { ProductEditComponent } from './components/products/product-edit/product-edit.component';
import { ProductDetailComponent } from './components/products/product_detail/product-detail.component';
import { CartComponent } from  './components/cart/cart.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // route par défaut vers login

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },

  { path: 'products', component: ProductListComponent },
  { path: 'add-product', component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductEditComponent }, 
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'panier', component: CartComponent },

  

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
