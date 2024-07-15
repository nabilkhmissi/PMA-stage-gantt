import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { ToastService } from "src/app/core/service/toast.service";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  clientForm: UntypedFormGroup;
  clients: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public authserv: AuthService,
    private fb: UntypedFormBuilder,
    private _toast : ToastService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.clients.fullName;
      this.clients = data.clients;
    } else {
      this.dialogTitle = "New Client";
    }
    this.clientForm = this.createContactForm();
  }
  formControl = new UntypedFormControl("", [
    Validators.required,
  ]);
  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
      ? "Not a valid email"
      : "";
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.clients.id],
      image: [this.clients.image],
      fullName: [this.clients.fullName],
      email: [this.clients.email],
      phone: [this.clients.phone],
      company: [this.clients.company],
    });
  }
  submit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {

this.authserv.updateuser(this.clients._id,this.clientForm.getRawValue()).subscribe({
  next:(res)=>{
    this._toast.setSuccess(res.message);
  }
})
  }
}
