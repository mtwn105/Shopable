import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderApi = environment.orderApi;

  constructor(private http: HttpClient) {
  }

  getMerchantOrders() {
    return this.http.get(`${this.orderApi}/merchant`);
  }

  getCustomerOrders() { return this.http.get(`${this.orderApi}/customer`); }

  placeOrder(order: any) {
    return this.http.post(`${this.orderApi}/customer`, order);
  }

}
