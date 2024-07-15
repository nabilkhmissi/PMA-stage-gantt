import { Component, Inject } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, tap } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProjectsService } from 'src/app/core/service/projects.service';

@Component({
  selector: 'app-share-file',
  templateUrl: './share-file.component.html',
  styleUrls: ['./share-file.component.scss']
})
export class ShareFileComponent {
  public shareFile: UntypedFormGroup;
  projectname:string;
  users : any[] = [];
  suggestions = [];
  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ShareFileComponent>,
    private snackBar: MatSnackBar,
    private projectServ: ProjectsService,
    private userServ : AuthService){}

    ngOnInit(){
      this.projectname = this.data.projectname
      this.shareFile = this.formBuilder.group({
        receiverEmail: new FormControl('',[Validators.required, Validators.email, Validators.minLength(5)]),
      });
      this.fetchUsers();
      this.shareFile.valueChanges.pipe(
        map(value => value.receiverEmail),
        tap(search => {
          if(search.length >= 1){
            this.suggestions = this.users.filter(user => user.email.toLowerCase().includes(search.toLowerCase())).map(user => user.email)
          }else{
            this.suggestions= []
            this.fetchUsers();
          }
        })        
        ).subscribe();
    }

    handleEmailSelect(email:string){
      this.shareFile.patchValue({
        receiverEmail : email
      })
    }

    fetchUsers(){
      this.userServ.getallUsers().subscribe((res:any[]) => this.users = res)
    }
    showNotification(colorName, text, placementFrom, placementAlign) {
      this.snackBar.open(text, "", {
        duration: 1000,
        verticalPosition: placementFrom,
        horizontalPosition: placementAlign,
        panelClass: colorName,
      });
    }
    sendFile(){
      const data={
        projectName : this.projectname,
        fileName:this.data.file,
        receiverEmail : this.shareFile.value.receiverEmail
      }
      this.projectServ.sendfile(data).subscribe()
    }
}
