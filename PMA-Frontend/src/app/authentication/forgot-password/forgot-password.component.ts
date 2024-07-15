import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { SenderService } from "src/app/core/service/sender.service";
import { ToastService } from "src/app/core/service/toast.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  authForm: UntypedFormGroup;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService :AuthService,
    private router:Router,
    private senderService:SenderService,
    private _toast : ToastService

  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: [
        "",
        [Validators.required, Validators.email],
      ],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.authForm.invalid) {
      this._toast.setError("Please enter a valid email");
      return;
    } else {
      let email={email:this.f.email.value};
      this.authService.forgotpasswd(email).subscribe(
        (res)=>{
          this._toast.setSuccess(res.message);
          this.senderService.email=email.email;
          this.router.navigate(["authentication/Validatecode"]);
        },
        (err)=>{
        }
      )
    }
  }
}
