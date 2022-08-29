import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  shop: any;
  products: any[] = [];
  shopUniqueName: any;
  loggedIn: boolean = false;
  user: any;

  constructor(private merchantService: MerchantService, private authService: AuthService,
    private snackbarService: SnackbarService, private router: Router, private inventoryService: InventoryService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    if (this.authService.getUserType() == 'CUSTOMER') {
      this.loggedIn = true;
      this.user = this.authService.getUserDetails();
    }

    if (!!this.activatedRoute.snapshot.paramMap.get("id")) {
      this.shopUniqueName = this.activatedRoute.snapshot.paramMap.get("id");
      this.getShop();
    }

  }

  getShop() {

    this.merchantService.getShop(this.shopUniqueName).subscribe(
      (response: any) => {
        this.shop = response;
        this.getInventory();
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

  getInventory() {
    this.inventoryService.getInventory(this.shop.merchantId).subscribe(
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

  viewProduct(product: any) {

    if (!this.loggedIn) {
      this.snackbarService.openSnackBar("Please login to view product details.");
      return;
    }

    this.router.navigate(['/store/' + this.shopUniqueName + '/product/' + product.entityId]);
  }

  login() {
    this.router.navigate(['/store/' + this.shopUniqueName + '/login']);
  }

  register() {
    this.router.navigate(['/store/' + this.shopUniqueName + '/register']);
  }

  logout() {
    this.authService.logout();
    this.snackbarService.openSnackBar("You have been logged out.");
  }

  viewOrders() {
    this.router.navigate(['/store/' + this.shopUniqueName + '/orders']);
  }

  viewCart() {
    this.router.navigate(['/store/' + this.shopUniqueName + '/cart']);
  }

}
