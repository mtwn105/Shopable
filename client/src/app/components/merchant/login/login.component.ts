import { Router } from '@angular/router';
import { SnackbarService } from './../../../services/snackbar.service';
import { AuthService } from './../../../services/auth.service';
import { MerchantService } from './../../../services/merchant.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder, private merchantService: MerchantService, private authService: AuthService, private snackService: SnackbarService, private router: Router) { }

  ngOnInit(): void {

    if (this.authService.getAuthToken()) {
      this.router.navigate(['/merchant/dashboard']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  login() {
    this.merchantService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      (response: any) => {
        this.authService.setAuthToken(response.token);
        this.authService.setUserDetails(response.merchant, "MERCHANT");
        this.router.navigate(['/merchant/dashboard']);
      },
      (error: any) => {
        this.snackService.openSnackBar(error.error.message);
      }
    );
  }

}
