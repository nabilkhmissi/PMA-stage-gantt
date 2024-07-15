import { Component } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "src/app/core/service/auth.service";

@Component({
  selector: "app-edit-client",
  templateUrl: "./edit-client.component.html",
  styleUrls: ["./edit-client.component.sass"],
})
export class EditClientComponent {
  clientForm: UntypedFormGroup;
  

  constructor(private fb: UntypedFormBuilder,private authService:AuthService,private snackBar:MatSnackBar) {
    this.clientForm = this.createContactForm();
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 1000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });}
  onSubmit() {
    console.log("Form Value", this.clientForm.value);
    this.authService.updateuser(this.clientForm.value._id,this.clientForm.value).subscribe({
      next:(res)=>{
        this.showNotification("snackbar-success",
        "User updated with success" ,
        "bottom",
        "center")
       window.scroll({
         top: 0,
         left: 0,
         behavior: 'smooth'
       });
    
      },
      error:(err)=> {
        this.showNotification("snackbar-danger",
        "Somthing went wrong" ,
        "bottom",
        "center")
      }
    })
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      name: [this.clientForm.value.name, [Validators.required]],
      mobile: [this.clientForm.value.mobile, [Validators.required]],
      email: [this.clientForm.value.email,[Validators.required, Validators.email, Validators.minLength(5)],],
      date: [this.clientForm.value.date, [Validators.required]],
      company_name: [this.clientForm.value.company_name, [Validators.required]],
      uploadImg: [this.clientForm.value.uploadImg],
    });
  }
}
