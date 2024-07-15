import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { SenderService } from 'src/app/core/service/sender.service';
import { saveAs } from 'file-saver';
import { TasksService } from 'src/app/core/service/tasks.service';
import { ReclamationService } from 'src/app/core/service/reclamation.service';
import { RisksService } from 'src/app/core/service/risks.service';
import { environment } from 'src/environments/environment';
import { ShareFileComponent } from '../share-file/share-file.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormDialogComponent } from 'src/app/task/dialogs/form-dialog/form-dialog.component';
import { DeleteComponent } from 'src/app/task/dialogs/delete/delete.component';
@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.sass']
})
export class ProjectDetailsComponent implements OnInit {
  note = 0
  projectID: any;
  project: any
  projectTasks: any[] = [];
  projectRisks: any[] = [];
  projectReclamation: any[] = [];
  imagesUrl = `${environment.apiUrl}/static/images`;
  statusSort = null;
  dateSort = -1;
  constructor(private activatedRoute: ActivatedRoute,
    private projectServ: ProjectsService,
    private taskServ: TasksService,
    private reclServ: ReclamationService,
    private riskServ: RisksService,
    private dialog: MatDialog,
    private snackBar : MatSnackBar) {
    this.activatedRoute.paramMap.subscribe({
      next: (p: ParamMap) => {
        this.projectID = p.get('id');

        this.projectServ.getProject(p.get('id')).subscribe({
          next: (res: any) => {
            this.project = res

            this.getReclamation(this.project)
            this.getTasks(this.project)
            this.getRisks(this.project)
            this.notecalc(this.project)
          },
          error: (err) => {
            // console.log(err);
          }
        })
      }
    }
    )
  }

  ngOnInit(): void { 
    // console.log(this.projectReclamation)
  }

  getTasks(p: any) {
    this.taskServ.getTaskbyprojectWithSort(p._id, this.statusSort, this.dateSort).subscribe({
      next: (res) => {
        this.projectTasks = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  handleStatusSelect(event: any) {
    this.statusSort = event.target.value;
    this.getTasks(this.project)
  }

  handleDateSort(event: any) {
    this.dateSort = event.target.value;
    this.getTasks(this.project)
  }

  getReclamation(project: any) {
    this.reclServ.getReclamationByProject(project._id).subscribe({
      next: (res) => {
        this.projectReclamation = res as any
        // console.log("gagag",this.projectReclamation);

      },
      error: (err) => {
        // console.log(err);
      }

    })
  }
  getRisks(project: any) {
    this.riskServ.getProbyProj(project._id).subscribe({
      next: (res) => {
        this.projectRisks = res
        //console.log("projectRiks",this.projectRisks);

      },
      error: (err) => {
        // console.log(err);

      }
    })
  }


  download(file) {
    this.projectServ.downloadfile(file).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'file' });
      const url = window.URL.createObjectURL(blob);
      //window.open(url);
      saveAs(blob, file);
    }), (error: any) => console.log('Error downloading the file'),
      () => console.info('File downloaded successfully');
  }
  sendToModal(file,projectname){
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef=this.dialog.open(ShareFileComponent, {
      height: "50%",
      width: "55%",
      autoFocus: true,
      data: {
        file,
        projectname
      },
      direction: tempDirection,
    });

  }
  notecalc(project: any) {
    let sum = 0
    project.note_equipe.forEach(n => {

      sum += n
    });
    this.note = (project.note_Client * 0.5 + project.note_Admin * 0.25 + sum * 0.25)
    //console.log(this.note);

  }

  //edit and delete tasks
  editCall(row) {
    // this.id = row._id;
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
        this.showNotification(
          "snackbar-success",
          "Edit task Successfully...!!!",
          "bottom",
          "center"
        );
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

        this.showNotification(
          "snackbar-danger",
          "Delete Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
