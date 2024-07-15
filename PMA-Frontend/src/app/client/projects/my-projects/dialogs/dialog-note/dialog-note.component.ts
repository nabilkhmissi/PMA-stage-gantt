import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-dialog-note',
  templateUrl: './dialog-note.component.html',
  styleUrls: ['./dialog-note.component.sass']
})
export class DialogNoteComponent {
  dialogTitle: string;
  noteForm: UntypedFormGroup;
  myProjects: any;
  note:any
  constructor(
    public dialogRef: MatDialogRef<DialogNoteComponent>, 
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectServ :ProjectsService,
    private _toast : ToastService
  ) {
      this.dialogTitle=data.myProjects.Projectname;
      this.myProjects=data.myProjects;
      this.noteForm = this.createContactForm();
  }
  createContactForm():UntypedFormGroup {
    return this.fb.group({
      q1: [""],
      q2: [""],
      q3: [""],
      q4: [""],
  })}
  confirm(){


let note=(this.noteForm.value.q1+this.noteForm.value.q2+this.noteForm.value.q3+this.noteForm.value.q4)/4
let data={
  "note":note
}
    this.projectServ.noteCleint(this.myProjects._id,data).subscribe({
      next:(res)=>{
        this._toast.setSuccess(res.message);
      }
    })

  }
  onNoClick(){  this.dialogRef.close();}

  submit() {
  }
}
