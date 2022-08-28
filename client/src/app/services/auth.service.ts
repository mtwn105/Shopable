import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

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

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  }

}
