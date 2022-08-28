import { Router } from '@angular/router';
import { SnackbarService } from './../../../services/snackbar.service';
import { AuthService } from './../../../services/auth.service';
import { MerchantService } from './../../../services/merchant.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  merchant: any;

  constructor(private merchantService: MerchantService, private authService: AuthService,
    private snackbarService: SnackbarService, public router: Router) { }

  ngOnInit(): void {

    this.getMerchant();
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

}
