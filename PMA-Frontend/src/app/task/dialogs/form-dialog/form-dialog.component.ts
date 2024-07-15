import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { formatDate } from '@angular/common';
import { TasksService } from 'src/app/core/service/tasks.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
})
export class FormDialogComponent implements OnInit {
  dialogTitle: string;
  myTasksForm: UntypedFormGroup;
  myTasks: any;
  employee: any;
  project: any;
  username: String;
  selectedProject: any;
  user;
  ProjectName: String;
  teamlist: any[]
  TeamLeaders: any[]//are the Team Leaders

  t: any
  tasksNB: any
  closedTasks: any = 0

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public taskserv: TasksService,
    private fb: UntypedFormBuilder,
    private authserv: AuthService,
    private projectser: ProjectsService,
    private _taost : ToastService
  ) {
    if (data.action === 'edit') {
      this.dialogTitle = data.myTasks.Title;
      this.myTasks = data.myTasks;
      this.createContactForm();
      this.selectedProject = this.myTasks.Project;
    } else {
      this.initEditMode();
    }
  }
  ngOnInit(): void {
    this.projectser.getAllProjects().subscribe({
      next: (res) => {
        this.project = res;
      },
    });
    this.authserv.getEngineer().subscribe({
      next: (res) => {
        this.teamlist = res;
      }
    })
    this.authserv.getallTeamLeader().subscribe({
      next: (res) => {
        this.TeamLeaders = res;
        this.TeamLeaders = this.TeamLeaders.concat(this.teamlist)
      }
    })
  }

  initEditMode() {
    this.dialogTitle = 'New Tasks';
    this.myTasks = {
      Project: '',
      Status: 'Pending',
      Priority: '',
      progress: '',
      Deadline: new Date(),
      Details: '',
      Executor: [],
      StartDate: new Date(),
    };
  }

  getProjectId(project1: any, project2: any): boolean {
    return project1 && project2 ? project1._id === project2._id : project1 === project2;
  }
  getExecutorId(executor1: any, executor2: any): boolean {
    return executor1 && executor2 ? executor1._id === executor2._id : executor1 === executor2;
  }
  createContactForm() {
    this.myTasksForm = this.fb.group({
      Title: [this.myTasks.Title],
      Project: [this.myTasks.Project],
      Status: [this.myTasks.Status],
      Priority: [this.myTasks.Priority],
      progress: [this.myTasks.progress],
      Executor: [this.myTasks.Executor],
      Date: [
        formatDate(this.myTasks.Deadline, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      StartDate: [
        formatDate(this.myTasks.StartDate, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      Details: [this.myTasks.Details],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    let data = {
      Title: this.myTasksForm.value.Title,
      projectId: this.myTasksForm.value.Project._id,
      Status: this.myTasksForm.value.Status || "Pending",
      Priority: this.myTasksForm.value.Priority,
      progress: this.myTasksForm.value.progress,
      Executor: JSON.stringify(this.myTasksForm.value.Executor.map(e => e._id)),
      Deadline: this.myTasksForm.value.Date,
      StartDate: this.myTasksForm.value.StartDate,
      Details: this.myTasksForm.value.Details,
    };
    if (this.data.action === 'edit') {
      this.taskserv.updatetask(this.myTasks._id, data).subscribe({
        next: (res) => {
          if ((data.Status == "Closed") && (data.progress == 100) && (this.myTasks.Project.progress < 100)) {
            this.taskserv.getTaskbyproject(this.myTasks.Project._id).subscribe({
              next: (res) => {
                this.t = res
                this.tasksNB = res.length
                for (let i = 0; i < this.t.length; i++) {
                  if (this.t[i].Status === "Closed" && this.t[i].progress === 100) {
                    this.closedTasks++
                  }
                }
                let prog = {
                  progress: (this.closedTasks / this.tasksNB * 100)
                }
                this.projectser.updateProg(this.myTasks.Project._id, prog).subscribe({
                  next: (res) => {
                    this._taost.setSuccess(res.message);
                  }
                })
              }
            })
          }
        }
      });
    } else {
      this.taskserv.addTask(data).subscribe({
        next: (res) => {
          this._taost.setSuccess(res.message);
        },
      });
    }
  }


  getfilteredFormData($event: any) {
    return (this.employee = $event.value.equipe);
  }
}
