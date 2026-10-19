import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  usernameOrEmail = '';
  password = '';
  confirmPassword = '';
  role = 'CLIENT';
  errorMessage = '';
  passwordMismatch = false;

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(): void {
    this.checkPasswords();
    if (this.passwordMismatch) {
      return;
    }

    const registerPayload = {
      username: this.usernameOrEmail,
      password: this.password,
      role: this.role,
      email: this.usernameOrEmail // Mets une vraie adresse email ici
    };

    this.authService.register(registerPayload).subscribe({
      next: () => {
        console.log('Inscription réussie !');
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Erreur lors de l\'inscription :', err);
        this.errorMessage = err?.error?.message || 'Erreur inconnue lors de l\'inscription.';
      }
    });
  }

  checkPasswords(): void {
    this.passwordMismatch =
      !!this.password &&
      !!this.confirmPassword &&
      this.password !== this.confirmPassword;
  }
}
