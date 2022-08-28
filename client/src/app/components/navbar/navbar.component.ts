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
  @Input() user: any;

  constructor(private authService: AuthService, private snackbarService: SnackbarService) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
    this.snackbarService.openSnackBar("You have been logged out.");
  }

}
