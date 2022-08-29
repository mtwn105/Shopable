import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { OrderService } from 'src/app/services/order.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-view-edit-order',
  templateUrl: './view-edit-order.component.html',
  styleUrls: ['./view-edit-order.component.scss']
})
export class ViewEditOrderComponent implements OnInit {

  merchant: any;
  order: any;
  orderId: any;
  status: any;

  statuses = ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"];

  constructor(private merchantService: MerchantService, private authService: AuthService,
    private snackbarService: SnackbarService, private router: Router, private orderService: OrderService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.getMerchant();

    if (!!this.activatedRoute.snapshot.paramMap.get("orderId")) {
      this.orderId = this.activatedRoute.snapshot.paramMap.get("orderId");
      this.getOrder();
    }

  }

  getMerchant() {

    const merchantId = this.authService.getUserDetails().entityId;

    this.merchantService.getMerchant(merchantId).subscribe(
      (response: any) => {
        this.merchant = response;
        this.getOrder();
      },
      (error: any) => {
        if (error.status == 401) {
          this.authService.logout();
          this.snackbarService.openSnackBar("Your session has expired. Please login again.");
        }
      }
    );
  }

  getOrder() {
    this.orderService.getMerchantOrder(this.orderId).subscribe(
      (response: any) => {
        this.order = response;
        this.status = this.order.status;
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

  viewProduct(product: any) {

    this.router.navigate(['/merchant/inventory/product/' + product.productId]);
  }

  updateOrder() {

    this.order.status = this.status;

    this.orderService.updateOrder(this.order).subscribe(
      (response: any) => {


        this.order = response;
        this.status = this.order.status;
        this.snackbarService.openSnackBar("Order updated successfully");
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
}
