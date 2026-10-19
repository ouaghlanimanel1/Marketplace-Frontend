import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];

  // BehaviorSubjects pour stocker et émettre les données
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  private cartTotalPriceSubject = new BehaviorSubject<number>(0);
  cartTotalPrice$: Observable<number> = this.cartTotalPriceSubject.asObservable();

  constructor() {}

  // Met à jour les BehaviorSubjects avec les dernières données
  private updateState(): void {
    this.cartItemsSubject.next(this.items);
    const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.cartTotalPriceSubject.next(total);
  }

  addToCart(product: any): void {
    const existing = this.items.find(item => item.productId === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      });
    }
    this.updateState();
  }

  updateQuantity(productId: string, quantity: number): void {
    this.items = this.items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    ).filter(item => item.quantity > 0);
    this.updateState();
  }

  removeFromCart(productId: string): void {
    this.items = this.items.filter(item => item.productId !== productId);
    this.updateState();
  }

  clearCart(): void {
    this.items = [];
    this.updateState();
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
