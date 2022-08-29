import { OrderService } from './../../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  merchant: any;
  orders: any[] = [];

  constructor(private merchantService: MerchantService, private authService: AuthService,
    private snackbarService: SnackbarService, private router: Router, private orderService: OrderService) { }

  ngOnInit(): void {
    this.getMerchant();
  }

  getMerchant() {

    const merchantId = this.authService.getUserDetails().entityId;

    this.merchantService.getMerchant(merchantId).subscribe(
      (response: any) => {
        this.merchant = response;
        this.getOrders();
      },
      (error: any) => {
        if (error.status == 401) {
          this.authService.logout();
          this.snackbarService.openSnackBar("Your session has expired. Please login again.");
        }
      }
    );
  }

  getOrders() {
    this.orderService.getMerchantOrders().subscribe(
      (response: any) => {
        this.orders = response;
      }
      ,
      (error: any) => {
        if (error.status == 401) {
          this.authService.logout();
          this.snackbarService.openSnackBar("Your session has expired. Please login again.");
        } else if (error.status != 404) {
          this.snackbarService.openSnackBar(error.error.message);
        }
      });


  }

  editOrder(order: any) {
    this.router.navigate(['/merchant/orders/order/' + order.entityId]);
  }

}
