import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthComponent} from './auth.component';
import {AuthLoginComponent} from './login/login.component';
import {AuthSingUpComponent} from './singup/singup.component';
import {AuthForgotPasswordComponent} from './forgot-password/forgot-password.component';
import { AuthLogoutComponent } from './logout/logout.component';


const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: AuthLoginComponent,
      },
      {
        path: 'logout',
        component: AuthLogoutComponent,
      },
      {
        path: 'registration',
        component: AuthSingUpComponent
      },
      {
        path: 'forgot-password',
        component: AuthForgotPasswordComponent
      },
      {path: '', redirectTo: 'login', pathMatch: 'full'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
