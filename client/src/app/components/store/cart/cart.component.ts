import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  product: any;
  shopUniqueName: any;
  shop: any;
  productId: any;
  user: any;
  addedToCart = false;
  cart: any;

  constructor(private formBuilder: FormBuilder, private merchantService: MerchantService, private authService: AuthService, private snackbarService: SnackbarService, private router: Router, private activatedRoute: ActivatedRoute, private customerService: CustomerService, private inventoryService: InventoryService) { }

  ngOnInit(): void {

    this.user = this.authService.getUserDetails();

    if (!!this.activatedRoute.snapshot.paramMap.get("id")) {
      this.shopUniqueName = this.activatedRoute.snapshot.paramMap.get("id");
      this.getShop();
    }

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

  addToCart() {
    this.customerService.addToCart(this.user.entityId, this.productId).subscribe(
      (response: any) => {
        this.snackbarService.openSnackBar("Product added to cart");
        this.addedToCart = true;
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

  }

  removeFromCart(product: any) {

    this.cart.items.forEach((item: any, index: any) => {
      if (item.productId == product.productId) {
        this.cart.items.splice(index, 1);
      }
    });

    this.customerService.updateCart(this.user.entityId, this.cart).subscribe(
      (response: any) => {
        this.snackbarService.openSnackBar("Product removed from cart");
        this.getCart();
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
