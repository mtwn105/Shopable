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
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    InventoryComponent,
    AddEditProductComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    MerchantService,
    InventoryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
