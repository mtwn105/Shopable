import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any;

  constructor(
    private router: Router
  ) { }

  setAuthToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getAuthToken() {
    return localStorage.getItem('authToken') ?? null;
  }

  setUserDetails(user: any, userType: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userType', userType);
  }

  getUserDetails() {
    return JSON.parse((localStorage.getItem('user') as string));
  }

  getUserType() {
    return localStorage.getItem('userType');
  }

  setStore(store: any) {
    localStorage.setItem('store', JSON.stringify(store));
  }

  getStore() {
    return JSON.parse((localStorage.getItem('store') as string));
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    if (this.router.url.includes('merchant')) {
      this.router.navigate(['/merchant/login']);
    }
  }

}
