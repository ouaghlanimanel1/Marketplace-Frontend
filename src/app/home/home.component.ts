// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // Assure-toi que ce fichier existe
})
export class HomeComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categoryGroups: { [key: string]: Product[] } = {};
  uniqueCategories: string[] = [];

  selectedCategory: string = '';
  searchQuery: string = '';

  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllProducts();
  }

  loadAllProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getAll().subscribe({
      next: (data: Product[]) => {
        this.allProducts = data;
        this.groupProductsByCategory(data);
        this.extractUniqueCategories(data);
        this.filterProducts();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des produits :', err);
        this.errorMessage = 'Impossible de charger les produits. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  extractUniqueCategories(products: Product[]): void {
    const categories = new Set<string>();
    for (const product of products) {
      if (product.category) {
        categories.add(product.category);
      }
    }
    this.uniqueCategories = Array.from(categories).sort();
  }

  groupProductsByCategory(products: Product[]): void {
    this.categoryGroups = products.reduce((groups: { [key: string]: Product[] }, product: Product) => {
      const category = product.category || 'Non classé';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(product);
      return groups;
    }, {});
  }

  onCategoryFilterChangeCustom(category: string): void {
    this.selectedCategory = category;
    this.filterProducts();
  }

  resetFilter(): void {
    this.selectedCategory = '';
    this.searchQuery = '';
    this.filterProducts();
  }

  filterProducts(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredProducts = this.allProducts.filter(product => {
      const matchesCategory =
        this.selectedCategory === '' || product.category === this.selectedCategory;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }

  goToDetails(productId?: string): void {
    if (productId) {
      this.router.navigate(['/products', productId]);
    }
  }
}
