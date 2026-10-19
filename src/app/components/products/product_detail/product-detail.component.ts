import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'] // Or .scss if you are using Sass
})
export class ProductDetailComponent implements OnInit {
  product?: Product; // Using '?' makes it optional, aligning with initial 'null'
  loading = true;
  errorMessage = '';
  productId: string | null = null; // Store the ID received from the route

  // NOUVELLE LIGNE : Propriété pour contrôler la visibilité du pop-up
  showPopup: boolean = false;

  // Affichage des boutons Modifier / Supprimer pour le vendeur propriétaire
  canManageProduct = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to paramMap to react to ID changes in the URL (e.g., if navigating from one product to another)
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.loadProductDetails(this.productId); // Call the loading function
      } else {
        this.errorMessage = 'ID produit manquant.';
        this.loading = false;
      }
    });
  }

  /**
   * Fetches product details from the service.
   * @param id The ID of the product to load.
   */
  loadProductDetails(id: string): void {
    this.loading = true; // Set loading state to true
    this.errorMessage = ''; // Clear any previous error messages
    this.product = undefined; // Clear previous product data

    this.productService.getById(id).subscribe({
      next: (prod) => {
        this.product = prod;
        this.loading = false;
        this.updateManagePermission();
      },
      error: (err) => {
        console.error('Error loading product details:', err); // Log the actual error for debugging
        this.errorMessage = 'Produit introuvable ou erreur serveur. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  /**
   * Retries loading product details.
   * This method is called when the "Réessayer" button is clicked in the error state.
   */
  retryLoad(): void {
    if (this.productId) {
      this.loadProductDetails(this.productId);
    } else {
      this.errorMessage = 'Impossible de réessayer : ID produit non disponible.';
    }
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
    // LIGNE MODIFIÉE : Remplacé alert par l'affichage du pop-up
    this.showPopup = true;
    document.body.classList.add('popup-open'); // Ajout de la classe pour désactiver le scroll
  }

  buyNow(product: any): void {
    this.addToCart(product);
    // Redirection vers la page panier si besoin :
    // this.router.navigate(['/panier']);
  }

  // NOUVELLE LIGNE : Méthode pour fermer le pop-up
  closePopup(): void {
    this.showPopup = false;
    document.body.classList.remove('popup-open'); // Suppression de la classe
  }

  // NOUVELLE LIGNE : Méthode pour naviguer vers le panier
  goToCart(): void {
    this.router.navigate(['/panier']); 
    this.closePopup();
  }

  editProduct(): void {
    if (!this.product || !this.product.id) {
      return;
    }
    this.router.navigate(['/products/edit', this.product.id]);
  }

  deleteProduct(): void {
    if (!this.product || !this.product.id) {
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    this.productService.delete(this.product.id).subscribe({
      next: () => {
        alert('Produit supprimé avec succès.');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du produit', err);
        alert('Une erreur est survenue lors de la suppression du produit.');
      }
    });
  }

  private updateManagePermission(): void {
    this.canManageProduct = this.authService.isSeller() || this.authService.isAdmin();
  }
}