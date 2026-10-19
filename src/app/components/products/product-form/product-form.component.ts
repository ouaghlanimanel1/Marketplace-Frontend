import { Component } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  product: Product = {
    name: '',
    description: '',
    price: 0,
    sellerId: '' ,
    category: ''
  };

  imageFile: File | null = null;
  imageInputInvalid = false;

  constructor(private productService: ProductService) {}

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
    this.imageInputInvalid = !this.imageFile;
  }

  saveProduct() {
    if (!this.imageFile) {
      this.imageInputInvalid = true;
      return;
    }

    this.productService.createWithImage(this.product, this.imageFile).subscribe({
      next: () => {
        alert('Produit ajouté avec image.');
        // Optionnel : reset formulaire
        this.product = { name: '', description: '', price: 0, sellerId: '', category: '' };
        this.imageFile = null;
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de l’ajout du produit.');
      }
    });
  }
}
