import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Importer tous les composants utilisés ici
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductDetailComponent } from './product_detail/product-detail.component';


@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent,
    ProductEditComponent,
    ProductDetailComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    ProductListComponent,
    ProductFormComponent,
    ProductEditComponent,
  ]
})
export class ProductsModule { }
