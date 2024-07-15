import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.sass']
})
export class DeleteProjectComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectServ :ProjectsService,
    private _toast : ToastService
  ) {}
onNoClick(): void {
  this.dialogRef.close();
}
confirmDelete(): void {
  this.projectServ.deleteProject(this.data.project._id).subscribe({
    next :(res)=>{
     this._toast.setSuccess(res.message);
    }
  })
}
}
