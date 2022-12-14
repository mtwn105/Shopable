import { RegisterComponent as StoreRegisterComponent } from './components/store/register/register.component';
import { LoginComponent as StoreLoginComponent } from './components/store/login/login.component';
import { HomeComponent as StoreHomeComponent } from './components/store/home/home.component';
import { LoadingService } from './services/loading.service';
import { AuthService } from './services/auth.service';
import { JwtInterceptor } from './interceptor/http.interceptor';
import { InventoryService } from './services/inventory.service';
import { MerchantService } from './services/merchant.service';
import { MaterialModule } from './material/material.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/merchant/login/login.component';
import { RegisterComponent } from './components/merchant/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InventoryComponent } from './components/merchant/inventory/inventory.component';
import { AddEditProductComponent } from './components/merchant/inventory/add-edit-product/add-edit-product.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/merchant/dashboard/dashboard.component';
import { OrdersComponent } from './components/merchant/orders/orders.component';
import { ViewEditOrderComponent } from './components/merchant/orders/view-edit-order/view-edit-order.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { ProductComponent } from './components/store/product/product.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { CartComponent } from './components/store/cart/cart.component';
import { PlaceOrderComponent } from './components/store/cart/place-order/place-order.component';
import { CustomerOrdersComponent } from './components/store/customer-orders/customer-orders.component';
import { ViewOrderComponent } from './components/store/customer-orders/view-order/view-order.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    InventoryComponent,
    AddEditProductComponent,
    FooterComponent,
    DashboardComponent,
    OrdersComponent,
    ViewEditOrderComponent,
    StoreHomeComponent,
    StoreLoginComponent,
    StoreRegisterComponent,
    ProductComponent,
    CartComponent,
    PlaceOrderComponent,
    CustomerOrdersComponent,
    ViewOrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatCarouselModule.forRoot()
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    MerchantService,
    InventoryService,
    AuthService,
    LoadingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
