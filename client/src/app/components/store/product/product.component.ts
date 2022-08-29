import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  product: any;
  shopUniqueName: any;
  shop: any;
  productId: any;
  user: any;
  addedToCart = false;

  constructor(private formBuilder: FormBuilder, private merchantService: MerchantService, private authService: AuthService, private snackbarService: SnackbarService, private router: Router, private activatedRoute: ActivatedRoute, private customerService: CustomerService, private inventoryService: InventoryService) { }

  ngOnInit(): void {

    this.user = this.authService.getUserDetails();

    if (!!this.activatedRoute.snapshot.paramMap.get("id")) {
      this.shopUniqueName = this.activatedRoute.snapshot.paramMap.get("id");
      this.getShop();
    }
    if (!!this.activatedRoute.snapshot.paramMap.get("productId")) {
      this.productId = this.activatedRoute.snapshot.paramMap.get("productId");
      this.getProduct();
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

  getProduct() {
    this.inventoryService.getProduct(this.productId).subscribe(
      (response: any) => {
        this.product = response;
      },
      (error: any) => {
        if (error.status == 401) {
          this.authService.logout();
          this.snackbarService.openSnackBar("Your session has expired. Please login again.");
        } else if (error.status != 404) {
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

  goToCart() {
    this.router.navigate(['/store/' + this.shopUniqueName + '/cart'])
  }

}
