import { Component, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { DialogNoteComponent } from '../dialog-note/dialog-note.component';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-addfile',
  templateUrl: './addfile.component.html',
  styleUrls: ['./addfile.component.sass']
})
export class AddfileComponent {
  dialogTitle: string;
  noteForm: UntypedFormGroup;
  myProjects: any;
  constructor(
    public dialogRef: MatDialogRef<DialogNoteComponent>, 
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectServ :ProjectsService,
    private _toast : ToastService
  
  ) {
      this.dialogTitle=data.project.Projectname;
      this.myProjects=data.project;
      this.noteForm = this.createContactForm();
  }
  createContactForm():UntypedFormGroup {
    return this.fb.group({
      File: [this.myProjects.lettre,],
  })}
  confirm(){
    let formData = new FormData();
    formData.append("file",this.noteForm.value.File,this.noteForm.value.File.name)

    this.projectServ.addletter(this.myProjects._id,formData).subscribe({
      next:(res)=>{
        this._toast.setSuccess(res.message);
      }
    })
  }
  onNoClick(){  this.dialogRef.close();}

  submit() {
    // emppty stuff
  }
}
