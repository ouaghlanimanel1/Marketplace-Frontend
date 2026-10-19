import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems$: Observable<CartItem[]>;
  cartTotalPrice$: Observable<number>;
  cartTotalItems: number = 0;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartTotalPrice$ = this.cartService.cartTotalPrice$;
  }

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(items => {
        this.cartTotalItems = items.reduce((total, item) => total + item.quantity, 0);
      });
  }

  incrementQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.productId, item.quantity + 1);
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.productId, item.quantity - 1);
    }
  }

  onUpdateQuantity(productId: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const newQuantity = parseInt(value, 10);

    if (!isNaN(newQuantity) && newQuantity >= 1) {
      this.cartService.updateQuantity(productId, newQuantity);
    } else {
      alert('Veuillez saisir une quantité valide (au moins 1).');
    }
  }

  onRemoveItem(productId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article du panier ?')) {
      this.cartService.removeFromCart(productId);
    }
  }

  onClearCart(): void {
    if (confirm('Êtes-vous sûr de vouloir vider tout votre panier ?')) {
      this.cartService.clearCart();
    }
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
