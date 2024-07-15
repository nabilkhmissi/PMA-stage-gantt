import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "src/app/core/service/auth.service";
import { ToastService } from "src/app/core/service/toast.service";
import { UtilsService } from "src/app/core/service/utils.service";
@Component({
  selector: "app-add-employee",
  templateUrl: "./add-employee.component.html",
  styleUrls: ["./add-employee.component.sass"],
})
export class AddEmployeeComponent implements OnInit {
  docForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  emplllForm:FormGroup
  constructor(
    private authService:AuthService,
    private formBuilder: FormBuilder,
    private _toast : ToastService

  ) {
    this.docForm = this.formBuilder.group({
      first: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      mobile: ["", [Validators.required]],
      password: ["", [Validators.required]],
      conformPassword: ["", [Validators.required]],
      HiringDate: [""],
      department: ["",[Validators.required]],
      address: [""],
      email: ["",[Validators.required, Validators.email, Validators.minLength(5)],],
      dob: ["", [Validators.required]],
      education: [""],
      uploadImg: [""],
    });
  }
  ngOnInit(): void {

  }
  resertFrom(){
    this.docForm.reset();

        this.docForm.reset();
Object.keys(this.docForm.controls).forEach(key => {
    this.docForm.get(key).setErrors(null) ;
});

  }
  onSubmit() {
    if(this.docForm.value.password==this.docForm.value.conformPassword){
      let formData = new FormData();
        formData.append( "fullName",this.docForm.value.first)
        formData.append("email",this.docForm.value.email)
        formData.append("password",this.docForm.value.password)
        if(this.docForm.value.uploadImg){
          formData.append("image",this.docForm.value.uploadImg,this.docForm.value.uploadImg.name)
        }
        formData.append("DateOfBirth",this.docForm.value.dob)
        formData.append("phone",this.docForm.value.mobile)
        formData.append("department",this.docForm.value.department)
        formData.append("gender",this.docForm.value.gender)
        formData.append("hiringDate",this.docForm.value.HiringDate)
        formData.append("roles","Engineer")

  this.authService.adduser(formData).subscribe({
    next:(res)=>{
      this._toast.setSuccess(res.message);      
      this.resertFrom();
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  })
    }else{
      this._toast.setError("Password missmatch / Invalid");
    }
  }
}
