import { AuthGuard } from './guard/auth.guard';
import { DashboardComponent } from './components/merchant/dashboard/dashboard.component';
import { RegisterComponent } from './components/merchant/register/register.component';
import { LoginComponent } from './components/merchant/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'merchant/login',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'merchant/register',
    component: RegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'merchant/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
