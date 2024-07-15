import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { ProjectDialogComponent } from '../project-dialog.component';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.sass']
})
export class NoteComponent {
  public note: UntypedFormGroup;
  public project: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NoteComponent>,
    private snackBar: MatSnackBar,
    private projectServ: ProjectsService,
    private authServ: AuthService
  ){
    this.project = data.project;
    this.note = this.formBuilder.group({
      name: [
        this.project?.note_Admin,
        [Validators.required ],
      ],
    });

  }
  noter(){

    let data={
      "note":this.note.value.name
    }
   // console.log(data);
    this.projectServ.noteAdmin(this.project._id,data).subscribe({
      next:(res)=>{
        //console.log(res);

      }
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
