import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { SenderService } from 'src/app/core/service/sender.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-validatecode',
  templateUrl: './validatecode.component.html',
  styleUrls: ['./validatecode.component.scss']
})
export class ValidatecodeComponent {
  codeForm: UntypedFormGroup;
  submitted = false;
email:string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private senderService:SenderService,
    private _toast : ToastService

  ) {}

  ngOnInit() {
    this.codeForm = this.formBuilder.group({
      code: ["", Validators.required],
    });
  }

  get f() {
    return this.codeForm.controls;
  }

  onSubmit() {
    this.submitted=true;
    if(this.codeForm.invalid){
      this._toast.setError("Please enter a valid code");
      return;
    }else {
      var data = {
        code:this.f.code.value,
        email:this.senderService.email
      }

      this.authService.validateCode(data).subscribe({
        next:(res)=>{
          let result=res
          this.senderService.id=result;
          this._toast.setSuccess(res.message);
          const sub=timer(3000).subscribe(() => {
            this.router.navigate(["authentication/locked"]);}
          )
         sub
        }
      })
    }
  }
}
