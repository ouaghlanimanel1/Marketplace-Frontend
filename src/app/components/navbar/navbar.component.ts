import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { CartService } from 'src/app/services/cart.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  title = 'marketplace';
  menuOpen = false;
  cartCount: number = 0;

  showAdminBoard = false;
  showSellerBoard = false;
  showUserBoard = false;

  user: any = null;
  isLoggedIn = false;
  private roles: string[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(
    public authService: AuthService, // utilisé dans le HTML
    private tokenStorage: TokenStorageService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn) {
      this.user = this.tokenStorage.getUser();
      this.roles = Array.isArray(this.user.role) ? this.user.role : [this.user.role];

      this.showSellerBoard = this.roles.includes('SELLER');
      this.showUserBoard = this.roles.includes('CLIENT');
      this.showAdminBoard = this.roles.includes('ADMIN');

      // Abonnement à cartItems$ pour mettre à jour cartCount en temps réel
      this.cartService.cartItems$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(items => {
          this.cartCount = items.reduce((total, item) => total + (item.quantity || 1), 0);
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['/login']);
  }
}
