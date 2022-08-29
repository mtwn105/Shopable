import { OrderService } from './../../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss']
})
export class CustomerOrdersComponent implements OnInit {

  shopUniqueName: any;
  shop: any;
  user: any;
  orders: any;

  constructor(private formBuilder: FormBuilder, private merchantService: MerchantService, private authService: AuthService, private snackbarService: SnackbarService, private router: Router, private activatedRoute: ActivatedRoute, private customerService: CustomerService, private orderService: OrderService) { }

  ngOnInit(): void {

    this.user = this.authService.getUserDetails();

    if (!!this.activatedRoute.snapshot.paramMap.get("id")) {
      this.shopUniqueName = this.activatedRoute.snapshot.paramMap.get("id");
      this.getShop();
    }

    this.getOrders();

  }

  getShop() {

    this.merchantService.getShop(this.shopUniqueName).subscribe(
      (response: any) => {
        this.shop = response;
      },
      (error: any) => {
        if (error.status == 401) {
          this.authService.logout();
          this.snackbarService.openSnackBar("Your session has expired. Please login again.");
        } else {
          this.snackbarService.openSnackBar(error.error.message);
        }
      }
    );
  }

  getOrders() {
    this.orderService.getCustomerOrders().subscribe(
      (response: any) => {
        this.orders = response;
      },
      (error: any) => {
        if (error.status == 401) {
          this.authService.logout(this.shopUniqueName);
          this.snackbarService.openSnackBar("Your session has expired. Please login again.");
        } else {
          this.snackbarService.openSnackBar(error.error.message);
        }
      }
    );
  }

  viewOrder(order: any) {

    this.router.navigate(['/store/' + this.shopUniqueName + '/order/' + order.entityId]);
  }



}
