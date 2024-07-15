import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { RisksService } from 'src/app/core/service/risks.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { FormComponent } from 'src/app/procesverbal/form/form.component';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.sass']
})
export class FormsComponent implements OnInit {

  action: string;
  dialogTitle: string;
  myRisks:any
  projects:any
myRiskForm:UntypedFormGroup
  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private riskSrv:RisksService,
    private fb: UntypedFormBuilder,
    private authserv:AuthService,
    private projectser:ProjectsService,
    private _toast : ToastService
  ) {
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.myRisks.title;
      this.myRisks = data.myRisks;
    } else  {
      this.dialogTitle = "New Risk";
      this.myRisks = {"title":"",
        "project":"",
        "action":"",
        "impact":"",
        "date":new Date(),
        "details":""
      };
    }
    this.myRiskForm = this.createContactForm();
  }
  submit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.projectser.getProjectsByTeamleader(this.authserv.getLoggedUser().id).subscribe({
      next:(res)=>{
        this.projects=res      }
    })
  }


  createContactForm(): UntypedFormGroup {
    return this.fb.group({
     title: [this.myRisks.title],
     project: [this.myRisks.project],
     action: [this.myRisks.action],
     impact: [this.myRisks.impact],
     date: [
        formatDate(this.myRisks.date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],

      details: [this.myRisks.details],
    });
  }

  public confirmAdd(): void {
let data ={
  "title":this.myRiskForm.value.title,
  "project":this.myRiskForm.value.project._id,
  "action":this.myRiskForm.value.action,
  "impact":this.myRiskForm.value.impact,
  "date":this.myRiskForm.value.date,
  "details":this.myRiskForm.value.details,
  "user":this.authserv.getLoggedUser().id
}

if(this.action=="add"){this.riskSrv.addRisk(data).subscribe({
  next:(res)=>{
    this._toast.setSuccess(res.message);
  }
})
}
else {
  this.riskSrv.updateProbleme(this.myRisks._id,data).subscribe({
    next:(res)=>{
      this._toast.setSuccess(res.message);
    }
  })
}
  }
}
