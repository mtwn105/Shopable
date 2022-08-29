import { UploadService } from './../../../../services/upload.service';
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
  images: any[] = [];
  message: any[] = [];
  progressInfos: any[] = [];
  selectedFileNames: any[] = [];
  selectedFiles: any;
  previews: any[] = [];
  imageUrls: any[] = [];
  imagesChanged = false;

  constructor(private formBuilder: FormBuilder, private merchantService: MerchantService, private authService: AuthService, private snackService: SnackbarService, private router: Router, private inventoryService: InventoryService, private activatedRoute: ActivatedRoute, private uploadService: UploadService) { }

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
        this.imageUrls = response.images;

        this.imageUrls.forEach((imageUrl: any) => {
          this.previews.push(imageUrl);
        }
        );

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

  async addProduct() {

    if (this.selectFiles.length > 3) {
      this.snackbarService.openSnackBar("Maximum 3 images can be uploaded.");
      return;
    }

    if (this.selectFiles.length == 0) {
      this.snackbarService.openSnackBar("Please upload atleast 1 image.");
      return;
    }

    await this.uploadImages();

    this.productForm.value.images = this.imageUrls;

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

  async updateProduct() {

    if (this.imagesChanged) {
      if (this.selectFiles.length > 3) {
        this.snackbarService.openSnackBar("Maximum 3 images can be uploaded.");
        return;
      }

      if (this.selectFiles.length == 0) {
        this.snackbarService.openSnackBar("Please upload atleast 1 image.");
        return;
      }

      await this.uploadImages();

    }

    this.productForm.value.images = this.imageUrls;

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

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;
    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      this.imagesChanged = true;
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(this.selectedFiles[i]);
        this.selectedFileNames.push(this.selectedFiles[i].name);
      }
    }
  }

  async uploadImages() {

    if (this.selectedFiles) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        await this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  async upload(idx: any, file: any) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    await this.uploadService.uploadFile(file).toPromise().then(
      (event: any) => {
        this.imageUrls.push(event.data);
      }).catch(
        (error: any) => {
          this.message = [];
          this.snackbarService.openSnackBar(error.error.message);
        }
      );
  }

}
