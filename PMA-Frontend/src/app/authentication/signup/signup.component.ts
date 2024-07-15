import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { delay, timer } from "rxjs";
//import { timingSafeEqual } from "crypto";
//import { AlertServiceService } from "src/app/core/service/alert/alert-service.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  authForm: UntypedFormGroup;
  submitted = false;
  returnUrl: string;
  hide = true;
  chide = true;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ["", Validators.required],
      email: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      password: ["", Validators.required],
      cpassword: ["", Validators.required],
      phone: ["", Validators.required],
      Role: ["", Validators.required],
      Gender:["", Validators.required],
      uploadImg:[""],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  get f() {
    return this.authForm.controls;
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  onSubmit() {

    const subscription = timer(3000).subscribe(() => {
      this.router.navigate(["authentication/signin"]);}

  )
    this.submitted = true;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      let formdata = new FormData();
      formdata.append("fullName", this.authForm.value.username)
      formdata.append("email", this.authForm.value.email)
      formdata.append("password", this.authForm.value.password)
      formdata.append("phone", this.authForm.value.phone)
      formdata.append( "roles",this.authForm.value.Role)
      formdata.append("gender",this.authForm.value.Gender)
      formdata.append("image",this.authForm.value.uploadImg,this.authForm.value.uploadImg.name)



      //formdata.append("package", this.package);
      //console.log(formdata);

      this.authService.register(formdata).subscribe({
        next: (response) => {
          this.showNotification(
            "snackbar-success",
            "Signup request sent succefully , waiting for admin confirmation",
            "bottom",
            "center"
          )

subscription;


        },
        error: (err) => {
          this.showNotification(
            "snackbar-danger",
            "Check your mail or password",
            "bottom",
            "center"
          );
        },
      });

      // this.router.navigate(["/admin/dashboard/dashboard2"]);
    }
  }
}
