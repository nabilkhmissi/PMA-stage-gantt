import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { LeadsService } from "../../leads.service";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { Leads } from "../../leads.model";
import { formatDate } from "@angular/common";
import { AuthService } from "src/app/core/service/auth.service";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  leadsForm: UntypedFormGroup;
  leads: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public leadsService: LeadsService,
    private fb: UntypedFormBuilder,
    private authService:AuthService

  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.leads.fullName;
      this.leads = data.leads;
    } else {
      this.dialogTitle = "New Leads";
      this.leads = new Leads({});
    }
    this.leadsForm = this.createContactForm();
  }
  formControl = new UntypedFormControl("", [
    Validators.required,
    // Validators.email,
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
      id: [this.leads.id],
      img: [this.leads.img],
      fullName: [this.leads.fullName],
      email: [this.leads.email],
      roles: [this.leads.roles],
      phone: [this.leads.phone],
     // department: [this.leads.department],
     // project: [this.leads.project],
    });
  }
  submit() {
    // emppty stuff
    let data = {
      fullname:this.leadsForm.value.fullName,
      email :this.leadsForm.value.email,
      phone:this.leadsForm.value.phone,
      roles:this.leadsForm.value.role
    }
   // console.log("ffff",data);

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.leadsService.addLeads(this.leadsForm.getRawValue());
  }
}
