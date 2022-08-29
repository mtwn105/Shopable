import { OrderService } from './../../../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit {

  product: any;
  shopUniqueName: any;
  shop: any;
  productId: any;
  user: any;
  addedToCart = false;
  cart: any;
  orderForm: any;

  constructor(private formBuilder: FormBuilder, private merchantService: MerchantService, private authService: AuthService, private snackbarService: SnackbarService, private router: Router, private activatedRoute: ActivatedRoute, private customerService: CustomerService, private orderService: OrderService) { }

  ngOnInit(): void {

    this.user = this.authService.getUserDetails();

    if (!!this.activatedRoute.snapshot.paramMap.get("id")) {
      this.shopUniqueName = this.activatedRoute.snapshot.paramMap.get("id");
      this.getShop();
    }

    this.orderForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.minLength(6)]],
      country: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    });

    this.getCart();

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

  getCart() {
    this.customerService.getCart(this.user.entityId).subscribe(
      (response: any) => {
        this.cart = response;
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

  placeOrder() {
    this.orderForm.value.phoneNumber = +this.orderForm.value.phoneNumber;

    this.orderForm.value.merchantId = this.shop.merchantId;
    this.orderForm.value.customerId = this.user.entityId;

    this.orderForm.value.items = this.cart.items;

    this.orderService.placeOrder(this.orderForm.value).subscribe(
      (response: any) => {

        this.cart.items = [];

        this.customerService.updateCart(this.user.entityId, this.cart).subscribe(
          (response: any) => {

            this.snackbarService.openSnackBar("Order placed successfully");
            this.router.navigate(['/store/' + this.shopUniqueName + '/orders']);
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
