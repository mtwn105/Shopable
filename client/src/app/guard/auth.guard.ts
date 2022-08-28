import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!!this.authService.getAuthToken()) {


      if ((state.url.includes("login") || state.url.includes("register") || (state.url.includes("home")) && this.authService.getUserType() == "MERCHANT")) {
        this.router.navigate(['/merchant/dashboard']);
        return true;
      }

      // if ((state.url.includes("login") || (state.url.includes("register")) && this.authService.getUserDetails().userType == "CUSTOMER")) {
      //   this.router.navigate(['/merchant/dashboard']);
      //   return true;
      // }

      if (state.url.includes("merchant") && this.authService.getUserType() != "MERCHANT") {
        this.router.navigate(['/merchant/login']);
        return false;
      }

      return true;
    } else {

      this.router.navigate(['/merchant/login']);
      return false;
    }
  }
}
