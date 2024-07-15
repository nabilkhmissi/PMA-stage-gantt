import { formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { SenderService } from 'src/app/core/service/sender.service';
import { TasksService } from 'src/app/core/service/tasks.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-form-my',
  templateUrl: './form-my.component.html',
  styleUrls: ['./form-my.component.sass']
})
export class FormMyComponent {
  tasks:any
  action: string;
  dialogTitle: string;
  myTasksForm: UntypedFormGroup;
  myTasks: any;
  employee:any
  project:any
  username:String
  user
  ProjectName:String
  selectedProject:any;

  constructor(
    public dialogRef: MatDialogRef<FormMyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public taskserv: TasksService,
    private fb: UntypedFormBuilder,
    private authserv:AuthService,
    private projectser:ProjectsService,
    private senderSev:SenderService,
    private _toast : ToastService
  ) {
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.myTasks.Title;
      this.myTasks = data.myTasks;
    } else  {
      this.dialogTitle = "New Tasks";
      this.myTasks = {"Project":"",
        //"Status":"",
        "Priority":"",
        "Type":"",
        "Deadline":new Date(),
        "Details":"",
        "StartDate":new Date()
      };
    }
    this.myTasksForm = this.createContactForm();
  }
  ngOnInit(): void {
    this.projectser.getProjectsByTeamleader(this.authserv.getLoggedUser().id).subscribe({
      next:(res)=>{
        this.project=res
      }
    })
  }
  formControl = new UntypedFormControl("", [
    Validators.required,
  ]);
  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
      ? "Not a valid email"
      : "";
  }
  getProjectId(project1: any, project2: any): boolean {
    return project1 && project2 ? project1._id === project2._id : project1 === project2;
  }
 
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
     Title: [this.myTasks.Title],
      Project: [this.myTasks.Project],
      StartDate: [
        formatDate(this.myTasks.StartDate, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      progress:[this.myTasks.progress],
      Status: [this.myTasks.Status],
      Priority: [this.myTasks.Priority],
      Type: [this.myTasks.Type],
      Executor: [this.myTasks.Executor._id],
      Deadline: [
        formatDate(this.myTasks.Deadline, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      Details: [this.myTasks.Details],
    });
  }
  submit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    let Ex={
      "_id":this.authserv.getLoggedUser().id
    }

  if(this.action === "edit") {
    let da = {
      Title: this.myTasksForm.value.Title,
      Project: this.myTasksForm.value.Project,
      Status: this.myTasksForm.value.Status,
      Priority: this.myTasksForm.value.Priority,
      Type: this.myTasksForm.value.Type,
      Executor: this.myTasksForm.value.Executor,
      Deadline: this.myTasksForm.value.Deadline,
      StartDate: this.myTasksForm.value.StartDate,
      Details: this.myTasksForm.value.Details,
      progress:this.myTasksForm.value.progress
    };
    this.taskserv.updatetask(this.myTasks._id,da).subscribe(
      {
        next:(res)=>{
          this._toast.setSuccess(res.message);
        }      
      }
    ) 
  }

else{
  let data={
    "Title":this.myTasksForm.value.Title,
    "Project":this.myTasksForm.value.Project,
    "Priority":this.myTasksForm.value.Priority,
    "Type":this.myTasksForm.value.Type,
    "Executor":Ex,
    "Deadline":this.myTasksForm.value.Deadline,
    "StartDate":this.myTasksForm.value.StartDate,
    "Details":this.myTasksForm.value.Details,
  }
    this.taskserv.addTask(data).subscribe({
      next:(res)=>{
        this.senderSev.task=res;
        this._toast.setSuccess(res.message);
      }
    });}
  }
  get filteredFormData() {
    if (this.selectedProject) {
      return this.selectedProject.equipe}
  }
}
