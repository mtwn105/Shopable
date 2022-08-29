import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customerApi = environment.customerApi;

  constructor(private http: HttpClient) { }

  login(merchantId: string, email: string, password: string) {
    return this.http.post(`${this.customerApi}/login`, { merchantId, email, password });
  }

  register(customer: any) {
    return this.http.post(`${this.customerApi}/register`, customer);
  }

  addToCart(customerId: string, productId: string) {
    return this.http.post(`${this.customerApi}/cart/${customerId}`, { productId });
  }

}
