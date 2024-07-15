import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProcesVerbalService } from 'src/app/core/service/proces-verbal.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private proceServ:ProcesVerbalService,
    private _toast : ToastService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.proceServ.deleteProcesV(this.data._id).subscribe({
      next:(res)=>{
        this._toast.setSuccess(res.message);
      }
    });
  }
}
