import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

const API_URL = 'http://localhost:8083/api/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {}

  login(usernameOrEmail: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/login`, { usernameOrEmail, password });
  }

  register(registerPayload: any): Observable<any> {
    return this.http.post(`${API_URL}/register`, registerPayload, { responseType: 'text' });
  }

  public isLoggedIn(): boolean {
    return !!this.tokenStorage.getToken();
  }

  public isAdmin(): boolean {
    const user = this.tokenStorage.getUser();
    return user && user.role && user.role.includes('ADMIN');
  }

  public isSeller(): boolean {
    const user = this.tokenStorage.getUser();
    return user && user.role && user.role.includes('SELLER');
  }

  public isClient(): boolean {
    const user = this.tokenStorage.getUser();
    return user && user.role && user.role.includes('CLIENT');
  }

  public logout(): void {
    this.tokenStorage.signOut();
  }
}
