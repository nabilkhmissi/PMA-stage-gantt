import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { ProjectsService } from "src/app/core/service/projects.service";
import { AuthService } from "src/app/core/service/auth.service";
import { ReclamationService } from "src/app/core/service/reclamation.service";
import { SenderService } from "src/app/core/service/sender.service";
import { ToastService } from "src/app/core/service/toast.service";

@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  claimform: UntypedFormGroup;
  claim: any;
  projects:any[]=[]
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private projectServ:ProjectsService,
    private authSer:AuthService,
    private reclamServ:ReclamationService,
    private fb: UntypedFormBuilder , 
    private SenderSev:SenderService,
    private _toast : ToastService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.claim.Title;
      this.claim= data.claim;
    } else {
      this.dialogTitle = "New Claim";
      this.claim={"Title":"","Comment":"","Addeddate":"","Type_Reclamation":"","project":""}
    }
    this.claimform = this.createContactForm();

    this.projectServ.getprojectbyClient(this.authSer.getLoggedUser().id).subscribe({
      next: (response) => {
        this.projects = response;
      }
    })
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
      Title: [this.claim.Title],
      Comment: [this.claim.Comment],
      Type_Reclamation: [this.claim.Type_Reclamation],
      project:[this.claim.project]
    });
  }
  submit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
  let data={
    "Title":this.claimform.value.Title,
    "Comment":this.claimform.value.Comment,
    "Type_Reclamation":this.claimform.value.Type_Reclamation,
    "projectId":this.claimform.value.project._id,
    "clientId":this.authSer.getLoggedUser().id
  }
  if(this.action=="add"){
    this.reclamServ.addReclamation(data).subscribe({
      next:(res)=>{
        this.SenderSev.claim=res;
        this._toast.setSuccess(res.message);
      }
    })
  }
  else{
    let d={
      "Title":this.claimform.value.Title,
      "Comment":this.claimform.value.Comment,
      "Type_Reclamation":this.claimform.value.Type_Reclamation,
      "projectId":this.claimform.value.project._id,
      "status":this.claimform.value.status
    }
    this.reclamServ.UpdateReclamation(this.claim._id,d).subscribe({
      next:(res)=>{
        this._toast.setSuccess(res.message);
      }
    })
  }
  }
}
