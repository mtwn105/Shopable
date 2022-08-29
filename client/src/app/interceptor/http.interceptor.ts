import { LoadingService } from './../services/loading.service';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private loadingService: LoadingService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if account is logged in and request is to the api url
    const token = this.authService.getAuthToken();
    const isLoggedIn = token != null && token.trim().length > 0;
    if (isLoggedIn) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    // Set loading when request in process and unset when request is complete
    this.loadingService.setLoading(true, request.url);

    return next.handle(request).pipe(
      finalize(() => {
        this.loadingService.setLoading(false, request.url);
      })
    );
  }
}