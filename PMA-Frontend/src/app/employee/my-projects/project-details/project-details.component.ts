import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { ReclamationService } from 'src/app/core/service/reclamation.service';
import { RisksService } from 'src/app/core/service/risks.service';
import { TasksService } from 'src/app/core/service/tasks.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from 'src/app/task/dialogs/form-dialog/form-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.sass']
})
export class ProjectDetailsComponent {
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
    private dialog : MatDialog,
    private _toast : ToastService,
    private riskServ: RisksService) {
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
          }
        })
      }
    }
    )
  }

  ngOnInit(): void { 
  }

  getTasks(p: any) {
    this.taskServ.getTaskbyprojectWithSort(p._id, this.statusSort, this.dateSort).subscribe({
      next: (res) => {
        this.projectTasks = res;
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
      },
    })
  }
  getRisks(project: any) {
    this.riskServ.getProbyProj(project._id).subscribe({
      next: (res) => {
        this.projectRisks = res
      }
    })
  }


  download(file) {
    this.projectServ.downloadfile(file).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'file' });
      const url = window.URL.createObjectURL(blob);
      saveAs(blob, file);
    }), (error: any) => console.log('Error downloading the file'),
      () => console.info('File downloaded successfully');
  }
  notecalc(project: any) {
    let sum = 0
    project.note_equipe.forEach(n => {

      sum += n
    });
    this.note = (project.note_Client * 0.5 + project.note_Admin * 0.25 + sum * 0.25)
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
}
