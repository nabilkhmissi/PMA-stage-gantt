import { formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { SenderService } from 'src/app/core/service/sender.service';
import { TasksService } from 'src/app/core/service/tasks.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
})
export class FormDialogComponent {
  tasks:any
  action: string;
  dialogTitle: string;
  myTasksForm: UntypedFormGroup;
  myTasks: any;
  employee: any;
  project: any;
  username: String;
  user;
  ProjectName: String;
  selectedProject: any;
  teamlist: any[]
  TeamLeaders: any[];

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public taskserv: TasksService,
    private fb: UntypedFormBuilder,
    private authserv: AuthService,
    private projectser: ProjectsService,
    private senderSer:SenderService,
    private _toast : ToastService,
  ) {

    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.myTasks.Title;
      this.myTasks = data.myTasks;
    } else {
      this.dialogTitle = 'New Tasks';
      this.myTasks = {
        Project: '',
        Status: '',
        Priority: '',
        Deadline: new Date(),
        Details: '',
        Executor: [],
        StartDate: new Date(),
      };
    }
    this.myTasksForm = this.createContactForm();
  }
  ngOnInit(): void {
    this.projectser
      .getProjectsByTeamleader(this.authserv.getLoggedUser().id)
      .subscribe({
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

  formControl = new UntypedFormControl('', [
    Validators.required,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  getProjectId(project1: any, project2: any): boolean {
    return project1 && project2 ? project1._id === project2._id : project1 === project2;
  }
  getExecutorId(executor1: any, executor2: any): boolean {
    return executor1 && executor2 ? executor1._id === executor2._id : executor1 === executor2;
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      Title: [this.myTasks.Title],
      Project: [this.myTasks.Project],
      StartDate: [
        formatDate(this.myTasks.StartDate, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      Status: [this.myTasks.Status],
      Priority: [this.myTasks.Priority],
      Executor: [this.myTasks.Executor],
      progress: [this.myTasks.progress],

      Deadline: [
        formatDate(this.myTasks.Deadline, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      Details: [this.myTasks.Details],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    if (this.action === 'edit') {
      let da = {
        Title: this.myTasksForm.value.Title,
        projectId: this.myTasksForm.value.Project._id,
        Status: this.myTasksForm.value.Status,
        Priority: this.myTasksForm.value.Priority,
        Executor: JSON.stringify(this.myTasksForm.value.Executor.map(e => e._id)),
        Deadline: this.myTasksForm.value.Deadline,
        StartDate: this.myTasksForm.value.StartDate,
        Details: this.myTasksForm.value.Details,
        progress:this.myTasksForm.value.progress
      };
      this.taskserv.updatetask(this.myTasks._id, da).subscribe({
        next: (res) => {
          this._toast.setSuccess(res.message);
        }
      });
    } else if(this.action=='add') {
      let data = {
        Title: this.myTasksForm.value.Title,
        projectId: this.myTasksForm.value.Project,
        Priority: this.myTasksForm.value.Priority,
        Executor: JSON.stringify(this.myTasksForm.value.Executor.map(e => e._id)),
        Deadline: this.myTasksForm.value.Deadline,
        StartDate: this.myTasksForm.value.StartDate,
        Details: this.myTasksForm.value.Details,
      };
      this.taskserv.addTask(data).subscribe({
        next: (res) => {
          this.senderSer.task=res
          this._toast.setSuccess(res.message);
        },
      });
    }
  }

  get filteredFormData() {
    if (this.selectedProject) {
      return this.selectedProject.equipe;
    }
  }
}
