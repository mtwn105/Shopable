
import { ViewOrderComponent } from './components/store/customer-orders/view-order/view-order.component';
import { CustomerOrdersComponent } from './components/store/customer-orders/customer-orders.component';
import { PlaceOrderComponent } from './components/store/cart/place-order/place-order.component';
import { CartComponent } from './components/store/cart/cart.component';
import { ProductComponent } from './components/store/product/product.component';
import { RegisterComponent as StoreRegisterComponent } from './components/store/register/register.component';
import { LoginComponent as StoreLoginComponent } from './components/store/login/login.component';
import { HomeComponent as StoreHomeComponent } from './components/store/home/home.component';
import { AddEditProductComponent } from './components/merchant/inventory/add-edit-product/add-edit-product.component';
import { OrdersComponent } from './components/merchant/orders/orders.component';
import { InventoryComponent } from './components/merchant/inventory/inventory.component';
import { AuthGuard } from './guard/auth.guard';
import { DashboardComponent } from './components/merchant/dashboard/dashboard.component';
import { RegisterComponent } from './components/merchant/register/register.component';
import { LoginComponent } from './components/merchant/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewEditOrderComponent } from './components/merchant/orders/view-edit-order/view-edit-order.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'merchant/login',
    component: LoginComponent,
  },
  {
    path: 'merchant/register',
    component: RegisterComponent,
  },
  {
    path: 'merchant/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'merchant/inventory',
    component: InventoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'merchant/inventory/product/:id',
    component: AddEditProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'merchant/inventory/product',
    component: AddEditProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'merchant/orders',
    component: OrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'merchant/orders/:orderId',
    component: ViewEditOrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'store/:id',
    component: StoreHomeComponent,
  },
  {
    path: 'store/:id/login',
    component: StoreLoginComponent,
  },
  {
    path: 'store/:id/register',
    component: StoreRegisterComponent,
  },
  {
    path: 'store/:id/cart',
    component: CartComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'store/:id/checkout',
    component: PlaceOrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'store/:id/orders',
    component: CustomerOrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'store/:id/orders/:orderId',
    component: ViewOrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'store/:id/product/:productId',
    component: ProductComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
