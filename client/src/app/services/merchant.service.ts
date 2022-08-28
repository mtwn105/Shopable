import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  merchantApi = environment.merchantApi;

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    return this.http.post(`${this.merchantApi}/login`, { email, password });
  }

  register(merchant: any) {
    return this.http.post(`${this.merchantApi}`, merchant);
  }

  getMerchant(merchantId: string) {
    return this.http.get(`${this.merchantApi}/${merchantId}`);
  }

}
