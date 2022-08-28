import { InventoryService } from './../../../../services/inventory.service';
import { InventoryComponent } from './../inventory.component';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})
export class AddEditProductComponent implements OnInit {

  productForm: FormGroup = new FormGroup({});
  merchant: any;
  snackbarService: any;
  productId: any;

  constructor(private formBuilder: FormBuilder, private merchantService: MerchantService, private authService: AuthService, private snackService: SnackbarService, private router: Router, private inventoryService: InventoryService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      discountPrice: [0, [Validators.required, Validators.min(1)]]
      ,
      price: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
    });

    this.getMerchant();

    if (!!this.activatedRoute.snapshot.paramMap.get("id")) {
      this.productId = this.activatedRoute.snapshot.paramMap.get("id");
      this.getProduct(this.activatedRoute.snapshot.paramMap.get("id"));
    }

  }

  getMerchant() {

    const merchantId = this.authService.getUserDetails().entityId;

    this.merchantService.getMerchant(merchantId).subscribe(
      (response: any) => {
        this.merchant = response;
      },
      (error: any) => {
        if (error.status == 401) {
          this.authService.logout();
          this.snackbarService.openSnackBar("Your session has expired. Please login again.");
        }
      }
    );
  }

  getProduct(id: any) {

    this.inventoryService.getProduct(id).subscribe(
      (response: any) => {
        this.productForm.patchValue(response);
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

    this.inventoryService.addProduct(this.productForm.value).subscribe(
      (response: any) => {
        this.snackService.openSnackBar("Product added successfully.");
        this.router.navigate(['/merchant/inventory']);
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

  updateProduct() {

    this.inventoryService.updateProduct(this.productId, this.productForm.value).subscribe(
      (response: any) => {
        this.snackService.openSnackBar("Product updated successfully.");
        this.router.navigate(['/merchant/inventory']);
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
