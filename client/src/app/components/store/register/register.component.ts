import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({});
  shopUniqueName: any;
  shop: any;

  constructor(private formBuilder: FormBuilder, private merchantService: MerchantService, private authService: AuthService, private snackbarService: SnackbarService, private router: Router, private activatedRoute: ActivatedRoute, private customerService: CustomerService) { }

  ngOnInit(): void {

    if (!!this.activatedRoute.snapshot.paramMap.get("id")) {
      this.shopUniqueName = this.activatedRoute.snapshot.paramMap.get("id");
      this.getShop();
    }

    if (this.authService.getAuthToken() && this.authService.getUserType() == 'CUSTOMER' && this.authService.getStore() == this.shopUniqueName) {
      this.router.navigate(['/store/' + this.shopUniqueName]);
    }

    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    });

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

  register() {

    this.registerForm.value.phoneNumber = +this.registerForm.value.phoneNumber;
    this.registerForm.value.merchantId = this.shop.merchantId;

    this.customerService.register(this.registerForm.value).subscribe(
      (response: any) => {
        this.snackbarService.openSnackBar("Registration successful. Please login to continue.");
        this.router.navigate(['/store/' + this.shopUniqueName + '/login']);
      },
      (error: any) => {
        this.snackbarService.openSnackBar(error.error.message);
      }
    );
  }

}
