import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { SenderService } from 'src/app/core/service/sender.service';
import { timer } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
@Component({
  selector: 'app-locked',
  templateUrl: './locked.component.html',
  styleUrls: ['./locked.component.scss'],
})
export class LockedComponent implements OnInit {
  passForm: UntypedFormGroup;
  submitted = false;
  default = '../../../assets/images/sa.jpg';
  userImg: string;
  userFullName: string;
  hide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private senderService: SenderService,
    private _toast: ToastService
  ) {}
  ngOnInit() {
    this.passForm = this.formBuilder.group({
      password: ['', Validators.required],
      cpassword: ['', Validators.required],
    });
  }
  get f() {
    return this.passForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.passForm.invalid) {
      this._toast.setError("Password empty/Missmatch, please try again")
      return;
    } 
    if (this.f.password.value == this.f.cpassword.value) {
      let ide = this.senderService.id;
      let data = {
        forgotPwdId : this.senderService.id.ide,
        email: this.senderService.email,
        password: this.f.password.value,
      };
      this.authService.change_psw(data).subscribe({
        next: (response) => {
          this._toast.setSuccess(response.message);
          const sub = timer(3000).subscribe(() => {
            this.router.navigate(["authentication/signin"]);}
          )
          sub
        }
      }); 
    }
  }
}
