import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    public authService: AuthService // 👉 Rendu public pour utilisation dans le HTML
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const source$ = this.authService.isSeller()
      ? this.productService.getForCurrentSeller()
      : this.productService.getAll();

    source$.subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  onEdit(product: Product): void {
    console.log('Edit product', product);
    this.router.navigate(['/products/edit', product.id]);
  }

  onDelete(id: string | undefined): void {
    if (!id) return;
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.productService.delete(id).subscribe(() => {
        this.loadProducts(); // recharge la liste après suppression
      });
    }
  }

  goToDetails(id: string | number): void {
    this.router.navigate(['/products', id]);
  }
}
