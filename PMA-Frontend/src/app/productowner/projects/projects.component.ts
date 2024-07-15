import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { ReclamationService } from 'src/app/core/service/reclamation.service';
import { TasksService } from 'src/app/core/service/tasks.service';
import { saveAs } from 'file-saver';
import { RisksService } from 'src/app/core/service/risks.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormDialogComponent } from 'src/app/task/dialogs/form-dialog/form-dialog.component';
import { DeleteComponent } from 'src/app/task/dialogs/delete/delete.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass']
})
export class ProjectsComponent {
  note=0
  projectRisks:any
  projectID:any;
  project:any
  projectTasks:any
  projectReclamation:any
    constructor(private activatedRoute: ActivatedRoute,
      private projectServ:ProjectsService,
      private taskServ:TasksService,
      private reclServ:ReclamationService,
      private riskServ:RisksService,
      private snackBar : MatSnackBar,
      private dialog : MatDialog,
      private _toast : ToastService
) { }

    ngOnInit(): void {


     this.activatedRoute.paramMap.subscribe({
      next: (p: ParamMap) => {
        this.projectID = p.get('id');
        this.projectServ.getProject(p.get('id')).subscribe({
          next: (res:any) => {
          this.project=res
          this.getReclamation(this.project)
          this.getTasks(this.project)
          this.getRisks(this.project)
          this.notecalc(this.project)
          }
        })

      }}
      )
    }

  getTasks(p:any){

    this.taskServ.getTaskbyproject(p._id).subscribe({
      next:(res)=>{
        this.projectTasks=res
      }
    })
  }

  getReclamation(project:any){
    this.reclServ.getReclamationByProject(project._id).subscribe({
      next:(res)=>{
        this.projectReclamation=res
      }
    })
  }
  getRisks(project:any){
    this.riskServ.getProbyProj(project._id).subscribe({
      next:(res)=>{
        this.projectRisks=res
      }
    })
  }

    download(file) {
      this.projectServ.downloadfile(file).subscribe((response: any) => {
        let blob:any = new Blob([response], { type: 'file' });
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, file);
        }), (error: any) => this._toast.setError("Oops ! there is an issue downloading the requested file"),
        () => {};
    }
    notecalc(project:any){
      let sum=0
      project.note_equipe.forEach(n => {
        sum+=n
      });
      this.note=(project.note_Client*0.5 + project.note_Admin*0.25 +sum*0.25);
    }

  editCall(row) {
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        myTasks: row,
        action: "edit",
      },
      direction: tempDirection,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const modifiedData = this.taskServ.getDialogData();

        const foundIndex = this.projectTasks.findIndex(
          (x: any) => x._id == row._id
        );
        this.projectTasks[foundIndex] = modifiedData;
      }
    });
  }
  deleteItem(i: number, row) {
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(DeleteComponent, {
      height: "270px",
      width: "400px",
      data: row,
      direction: tempDirection,
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.projectTasks = this.projectTasks.filter((item: any) => {
          return item._id !== row._id;
        });
      }
    });
  }
}
