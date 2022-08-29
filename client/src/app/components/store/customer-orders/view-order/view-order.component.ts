import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { OrderService } from 'src/app/services/order.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {

  shopUniqueName: any;
  shop: any;
  user: any;
  order: any;
  orderId: any;

  constructor(private formBuilder: FormBuilder, private merchantService: MerchantService, private authService: AuthService, private snackbarService: SnackbarService, private router: Router, private activatedRoute: ActivatedRoute, private customerService: CustomerService, private orderService: OrderService) { }

  ngOnInit(): void {

    this.user = this.authService.getUserDetails();

    if (!!this.activatedRoute.snapshot.paramMap.get("id")) {
      this.shopUniqueName = this.activatedRoute.snapshot.paramMap.get("id");
      this.getShop();
    }
    if (!!this.activatedRoute.snapshot.paramMap.get("orderId")) {
      this.orderId = this.activatedRoute.snapshot.paramMap.get("orderId");
      this.getOrder();
    }
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

  getOrder() {
    this.orderService.getCustomerOrder(this.orderId).subscribe(
      (response: any) => {
        this.order = response;
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

  viewProduct(product: any) {

    this.router.navigate(['/store/' + this.shopUniqueName + '/product/' + product.productId]);
  }

  cancelOrder() {
    this.orderService.cancelCustomerOrder(this.orderId).subscribe(
      (response: any) => {
        this.order = response;
        this.snackbarService.openSnackBar("Order cancelled successfully.");
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

}
