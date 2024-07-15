import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { TasksService } from "src/app/core/service/tasks.service";
import { ToastService } from "src/app/core/service/toast.service";
//import { MyTasksService } from "../../my-tasks.service";

@Component({
  selector: "app-delete",
  templateUrl: "./delete.component.html",
  styleUrls: ["./delete.component.sass"],
})
export class DeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskserv: TasksService,
    private _toast : ToastService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
   this.taskserv.deleteTask(this.data._id).subscribe({
    next:(res)=>{
      this._toast.setSuccess(res.message);
    }
   })
  }
}
