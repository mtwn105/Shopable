import { CustomerService } from './../../../services/customer.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});
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

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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

  login() {
    this.customerService.login(this.shop.merchantId, this.loginForm.value.email, this.loginForm.value.password).subscribe(
      (response: any) => {
        this.authService.setAuthToken(response.token);
        this.authService.setUserDetails(response.customer, "CUSTOMER");
        this.authService.setStore(this.shopUniqueName);
        this.router.navigate(['/store/' + this.shopUniqueName]);
      },
      (error: any) => {
        this.snackbarService.openSnackBar(error.error.message);
      }
    );
  }

}
