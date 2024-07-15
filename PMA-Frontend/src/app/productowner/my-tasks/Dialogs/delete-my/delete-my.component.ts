import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TasksService } from 'src/app/core/service/tasks.service';

@Component({
  selector: 'app-delete-my',
  templateUrl: './delete-my.component.html',
  styleUrls: ['./delete-my.component.sass']
})
export class DeleteMyComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteMyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskserv: TasksService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
   // this.myTasksService.deleteMyTasks(this.data.id);
   this.taskserv.deleteTask(this.data._id).subscribe({
    next:(res)=>{
     // console.log(res);

    },
    error:(err)=>{
      console.log(err);

    }
   })
  }
}
