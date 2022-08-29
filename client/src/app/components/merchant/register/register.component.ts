import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder, private merchantService: MerchantService, private authService: AuthService, private snackService: SnackbarService, private router: Router) { }

  ngOnInit(): void {

    if (this.authService.getAuthToken()) {
      this.router.navigate(['/merchant/dashboard']);
    }

    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.minLength(6)]],
      country: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      shopName: ['', [Validators.required]],
      shopUniqueName: ['', [Validators.required]],
    });

  }

  register() {

    this.registerForm.value.phoneNumber = +this.registerForm.value.phoneNumber;

    this.merchantService.register(this.registerForm.value).subscribe(
      (response: any) => {
        this.snackService.openSnackBar("Registration successful. Please login to continue.");
        this.router.navigate(['/merchant/login']);
      },
      (error: any) => {
        this.snackService.openSnackBar(error.error.message);
      }
    );
  }

}
