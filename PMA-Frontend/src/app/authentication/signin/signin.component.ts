import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { Role } from "src/app/core/models/role";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { ToastService } from "src/app/core/service/toast.service";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  authForm: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = "";
  hide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private _toast : ToastService
  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.loading = true;
    if (this.authForm.invalid) {
      this.error = "Username and Password not valid !";
      return;
    } else {
    this.subs.sink = this.authService
        .login(this.f.username.value, this.f.password.value)
        .subscribe(
          (res) => {
            this._toast.setSuccess("Authenticated successfully")
            if (res) {
                setTimeout(() => {
                const role = res.roles[0];
                if (role == Role.Admin) {
                  this.router.navigate(["/admin/dashboard/main"]);
                } else if (role == Role.Engineer){
                  this.router.navigate(["/employee/dashboard"]);
                } else if (role == Role.Client) {
                  this.router.navigate(["/client/dashboard"]);
                }
                else if(role==Role.TeamLeader){
                  this.router.navigate(["/TeamLeader/dashboard"])
                }
                else{
                  this.router.navigate(["authentication/signin"])
                }
                this.loading = false;

              }, 1000);
            } else {
              this.error = "Invalid Login";
            }
          },
          (error) => {
            this.loading = false;
          }
      );
    }
  }
}
