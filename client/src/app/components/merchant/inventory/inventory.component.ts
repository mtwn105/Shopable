import { InventoryService } from './../../../services/inventory.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  merchant: any;
  products: any[] = [];

  constructor(private merchantService: MerchantService, private authService: AuthService,
    private snackbarService: SnackbarService, private router: Router, private inventoryService: InventoryService) { }

  ngOnInit(): void {
    this.getMerchant();
  }

  getMerchant() {

    const merchantId = this.authService.getUserDetails().entityId;

    this.merchantService.getMerchant(merchantId).subscribe(
      (response: any) => {
        this.merchant = response;
        this.getInventory();
      },
      (error: any) => {
        if (error.status == 401) {
          this.authService.logout();
          this.snackbarService.openSnackBar("Your session has expired. Please login again.");
        }
      }
    );
  }

  getInventory() {
    this.inventoryService.getInventory(this.merchant.entityId).subscribe(
      (response: any) => {
        this.products = response;
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

  addProduct() {
    this.router.navigate(['/merchant/inventory/product/']);
  }

  editProduct(product: any) {
    this.router.navigate(['/merchant/inventory/product/' + product.entityId]);
  }

}
