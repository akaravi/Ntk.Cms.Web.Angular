import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth.routing';
import { AuthLoginComponent } from './login/login.component';
import { AuthSingUpComponent } from './singup/singup.component';
import { AuthForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthLogoutComponent } from './logout/logout.component';
import { AuthComponent } from './auth.component';
import { TranslationModule } from '../../core/i18n/translation.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AuthLoginComponent,
    AuthSingUpComponent,
    AuthForgotPasswordComponent,
    AuthLogoutComponent,
    AuthComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule
  ]
})
export class AuthModule { }
