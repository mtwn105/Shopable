import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  inventoryApi = environment.inventoryApi;

  constructor(private http: HttpClient) {
  }

  getInventory(merchantId: string) {
    return this.http.get(`${this.inventoryApi}/all/${merchantId}`);
  }

  addProduct(product: any) {
    return this.http.post(`${this.inventoryApi}/create`, product);
  }

  updateProduct(productId: string, product: any) {
    return this.http.put(`${this.inventoryApi}/update/${productId}`, product);
  }

  getProduct(productId: string) {
    return this.http.get(`${this.inventoryApi}/get/${productId}`);
  }

}
