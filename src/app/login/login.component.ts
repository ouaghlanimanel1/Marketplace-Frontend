import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  usernameOrEmail = '';
  password = '';
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  showAdminBoard = false;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.authService.login(this.usernameOrEmail, this.password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data.user);

        this.isLoginFailed = false;
        this.isLoggedIn = true;

        //this.roles = data.user.roles;
        //this.showAdminBoard = this.roles.includes('ADMIN');
        this.router.navigate(['/home']);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Nom ou mot de passe incorrect';
        this.isLoginFailed = true;
      }
    });
  }
}
