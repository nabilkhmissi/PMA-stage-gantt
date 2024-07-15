import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { formatDate } from "@angular/common";
import { ProjectsService } from "src/app/core/service/projects.service";
import { AuthService } from "src/app/core/service/auth.service";
import { SenderService } from "src/app/core/service/sender.service";
import { ToastService } from "src/app/core/service/toast.service";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  usr:any
  dialogTitle: string;
  myProjectsForm: UntypedFormGroup;
  myProjects: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public projectServ: ProjectsService,
    private fb: UntypedFormBuilder,
    private authServ :AuthService,
    private sender :SenderService,
    private _taost : ToastService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.myProjects.Projectname;
      this.myProjects = data.myProjects;

    } else {
      this.dialogTitle = "New Project";

      this.myProjects = {
        "Projectname":"",
        "type":"",
        "dateFin":new Date(),
        "description":"",
      };
    }
    this.myProjectsForm = this.createContactForm();
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
      Projectname: [this.myProjects.Projectname],
      type: [this.myProjects.type],
      dateFin: [
        formatDate(this.myProjects.dateFin, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      description:[this.myProjects.description],
      note: [this.myProjects.note_Client],
      File: [this.myProjects.file,],
    });
  }
  submit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
   if(this.action=="edit"){
    this.projectServ.updateProject(this.myProjects._id,this.myProjectsForm.getRawValue()).subscribe({
      next: (res) => {
        this._taost.setSuccess(res.message);
      }
    })
   }else if(this.action=="add"){
    let formData = new FormData();
    formData.append("Projectname",this.myProjectsForm.value.Projectname)
    formData.append("description",this.myProjectsForm.value.description)
    formData.append("type",this.myProjectsForm.value.type)
    formData.append("client",this.authServ.getLoggedUser().id)
    formData.append("dateFin",this.myProjectsForm.value.dateFin)
    formData.append("file",this.myProjectsForm.value.File,this.myProjectsForm.value.File.name)

this.projectServ.createProject(formData).subscribe({
  next:(res)=>{
  this._taost.setSuccess(res.message);
  this.sender.project=res
    }
})
}

}
}
