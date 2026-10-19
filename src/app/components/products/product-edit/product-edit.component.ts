import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  productId!: string;
  loading = false;
  errorMessage = '';
  selectedImageFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadProduct();
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['']
    });
  }

  loadProduct() {
    this.loading = true;
    this.productService.getById(this.productId).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue(product);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur chargement produit.';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;
    const updatedProduct: Product = {
      id: this.productId,
      ...this.productForm.value
    };

    const request$ = this.selectedImageFile
      ? this.productService.updateWithImage(this.productId, updatedProduct, this.selectedImageFile)
      : this.productService.update(this.productId, updatedProduct);

    request$.subscribe({
      next: () => {
        this.loading = false;
        alert('Produit mis à jour avec succès !');
        this.router.navigate(['/products']);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la mise à jour.';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    this.selectedImageFile = file ?? null;
  }
}
