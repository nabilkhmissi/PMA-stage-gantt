import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { ReclamationService } from "src/app/core/service/reclamation.service";
import { ToastService } from "src/app/core/service/toast.service";
//import { TicketsService } from "../../tickets.service";
@Component({
  selector: "app-delete",
  templateUrl: "./delete.component.html",
  styleUrls: ["./delete.component.sass"],
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reclServ:ReclamationService,
    private _taost : ToastService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
this.reclServ.deleteReclamation(this.data._id).subscribe({
  next: (res) => {
   this._taost.setSuccess(res.message);

  }
}) }
}
