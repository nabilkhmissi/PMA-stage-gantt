import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthenticationRoutingModule } from "./authentication-routing.module";
import { Page500Component } from "./page500/page500.component";
import { Page404Component } from "./page404/page404.component";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { LockedComponent } from "./locked/locked.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ValidatecodeComponent } from './validatecode/validatecode.component';
import { MatSelectModule } from "@angular/material/select";
import { SharedModule } from "../shared/shared.module";
import { ComponentsModule } from "../shared/components/components.module";
@NgModule({
  declarations: [
    Page500Component,
    Page404Component,
    SigninComponent,
    SignupComponent,
    LockedComponent,
    ForgotPasswordComponent,
    ValidatecodeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    SharedModule,
    ComponentsModule
  ],
})
export class AuthenticationModule {}
