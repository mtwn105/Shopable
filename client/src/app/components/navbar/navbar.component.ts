import { Router } from '@angular/router';
import { SnackbarService } from './../../services/snackbar.service';
import { AuthService } from './../../services/auth.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() title: string = 'Navbar';
  @Input() showBackButton: boolean = false;
  @Input() backRoute: string = 'Navbar';
  @Input() user: any;
  @Input() userType: string = '';
  @Input() shopUniqueName: string = '';

  constructor(private authService: AuthService, private snackbarService: SnackbarService, private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
    this.snackbarService.openSnackBar("You have been logged out.");
  }

  back() {
    this.router.navigate([this.backRoute]);
  }

  visitMerchantStore() {
    this.router.navigate([]).then(result => { window.open("/store/" + this.user.shopUniqueName, '_blank'); });;
  }

  viewOrders() {
    this.router.navigate(['/store/' + this.shopUniqueName + '/orders']);
  }

  viewCart() {
    this.router.navigate(['/store/' + this.shopUniqueName + '/cart']);
  }

}
