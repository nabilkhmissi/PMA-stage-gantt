import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { ReclamationService } from "src/app/core/service/reclamation.service";
import { ToastService } from "src/app/core/service/toast.service";

@Component({
  selector: "app-delete",
  templateUrl: "./delete.component.html",
  styleUrls: ["./delete.component.sass"],
})
export class DeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reclamServ: ReclamationService,
    private _toast : ToastService
  ) {
    console.log(data);

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
   this.reclamServ.deleteReclamation(this.data._id).subscribe({
    next:(res)=>{
      this._toast.setSuccess(res.message);
    }
   })
  }
}
