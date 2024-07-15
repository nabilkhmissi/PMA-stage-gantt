import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AuthService } from 'src/app/core/service/auth.service';
import { ToastService } from 'src/app/core/service/toast.service';
@Component({
  selector: 'app-confrim',
  templateUrl: './confrim.component.html',
  styleUrls: ['./confrim.component.sass']
})
export class ConfrimComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfrimComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _toast: ToastService,
    private authService :AuthService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.authService.confirm_signup(this.data._id,this.data).subscribe(
      {
        next:(res)=>{
         this._toast.setSuccess(res.message);
        }
      }
    );
  }

}
