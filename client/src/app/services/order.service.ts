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

  getCustomerOrder(orderId: string) {
    return this.http.get(`${this.orderApi}/customer/${orderId}`);
  }

  getMerchantOrder(orderId: string) {
    return this.http.get(`${this.orderApi}/merchant/${orderId}`);
  }

  cancelCustomerOrder(orderId: string) {
    return this.http.delete(`${this.orderApi}/customer/${orderId}`);
  }

  updateOrder(order: any) {
    return this.http.put(`${this.orderApi}/merchant/${order.entityId}`, order);
  }

}
