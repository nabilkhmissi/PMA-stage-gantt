import { Component } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { ToastService } from "src/app/core/service/toast.service";

@Component({
  selector: "app-add-client",
  templateUrl: "./add-client.component.html",
  styleUrls: ["./add-client.component.sass"],
})
export class AddClientComponent {
  clientForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  constructor(
    private fb: UntypedFormBuilder,
    private _toast:ToastService,
    private authService:AuthService
  ) {
    this.clientForm = this.fb.group({
      name: ["", [Validators.required]],
      mobile: ["", [Validators.required]],
      email: ["",[Validators.required, Validators.email, Validators.minLength(5)],],
      date: ["", [Validators.required]],
      company_name: ["", [Validators.required]],
      uploadImg: [""],
      password: ["", [Validators.required]],
      conformPassword: ["", [Validators.required]],
    });
  }
  onSubmit() {
    console.log("Form Value", this.clientForm.value);
    if (this.clientForm.value.password==this.clientForm.value.conformPassword)
   { let formData=new FormData();
    formData.append("fullName",this.clientForm.value.name);
    formData.append("email",this.clientForm.value.email);
    formData.append("password",this.clientForm.value.password);
    formData.append("phone",this.clientForm.value.mobile)
    formData.append("company",this.clientForm.value.company_name);
    formData.append("roles","Client");
    formData.append("image",this.clientForm.value.uploadImg,this.clientForm.value.uploadImg.name)


this.authService.adduser(formData).subscribe({
  next:(res)=>{
    this._toast.setSuccess(res.message);
   this.resetFrom();
   window.scroll({
     top: 0,
     left: 0,
     behavior: 'smooth'
   });

    }
  })
  }
  else{
    this._toast.setError("Password Missmatch / Invalid");
  }
}

resetFrom(){
  this.clientForm.reset();
  this.clientForm.reset();
  Object.keys(this.clientForm.controls).forEach(key => {
  this.clientForm.get(key).setErrors(null) ;
})
}
}
