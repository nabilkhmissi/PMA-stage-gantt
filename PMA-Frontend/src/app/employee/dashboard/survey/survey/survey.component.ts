import { formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProjectsService } from 'src/app/core/service/projects.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.sass']
})
export class SurveyComponent {
  action: string;
  dialogTitle: string;
  myRisks:any
  projects:any
myRiskForm:UntypedFormGroup


/* "title",
  "project",

  "status",
  "impact",
  "date",
  "details",
 */

  constructor(
    public dialogRef: MatDialogRef<SurveyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
private authSer:AuthService,
    private projectser:ProjectsService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "add") {
      this.dialogTitle = "New Survey";

      this.projects=data.proj
     // console.log(this.projects);

    }
    this.myRiskForm = this.createContactForm();
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {


  }


  createContactForm(): UntypedFormGroup {
    return this.fb.group({
     q1: [""],
     q2: [""],
     q3: [""],
     q4: [""],
     q5: [""],
     q6: [""],
     q7: [""],
     q8: [""],

    });
  }

  public confirmAdd(): void {


let note=(this.myRiskForm.value.q1+this.myRiskForm.value.q2+this.myRiskForm.value.q3+this.myRiskForm.value.q4+this.myRiskForm.value.q5+this.myRiskForm.value.q6+this.myRiskForm.value.q7+this.myRiskForm.value.q8)/8
//console.log("daaaa",note);
let data={
  "note":note
}
this.projectser.notequipe(this.projects._id,data).subscribe(
  {next :(res)=>{
    //console.log(res);

  }}
)





  }
}
