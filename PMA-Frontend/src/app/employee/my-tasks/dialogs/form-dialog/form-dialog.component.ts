import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { formatDate } from "@angular/common";

import { TasksService } from "src/app/core/service/tasks.service";
import { ProjectsService } from "src/app/core/service/projects.service";
import { ToastService } from "src/app/core/service/toast.service";

@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  t: any
  tasksNB: any
  closedTasks: any = 0
  action: string;
  dialogTitle: string;
  myTasksForm: UntypedFormGroup;
  myTask: any;
  isDetails = false;
  isDisabled: boolean = true
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public myTasksService: TasksService,
    private fb: UntypedFormBuilder,
    private projectSer: ProjectsService,
    private _toast : ToastService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.myTasks.Title;
      this.myTask = data.myTasks;
    } else {
      this.dialogTitle = "Tasks Details";
      this.myTask = data.myTasks
      this.isDetails = true
    }
    this.myTasksForm = this.createContactForm();
  }
  formControl = new UntypedFormControl("", [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
        ? "Not a valid email"
        : "";
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      Title: [this.myTask.Title],
      Project: [this.myTask.Project.Projectname],
      Status: [this.myTask.Status],
      Priority: [this.myTask.Priority],
      progress: [this.myTask.progress],
      date: [
        formatDate(this.myTask.Deadline, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      details: [this.myTask.Details],
    });

  }
  submit() {
  }
  getTasks() {
    this.myTasksService.getTaskbyproject(this.myTask.Project._id).subscribe({
      next: (res) => {
        this.tasksNB = res.length
      }
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    let data = {
      "Title": this.myTask.Title,
      "projectId": this.myTask.Project._id,
      "Executor": JSON.stringify(this.myTask.Project.equipe),
      "Status": this.myTasksForm.value.Status,
      "Priority": this.myTask.Priority,
      "progress": this.myTasksForm.value.progress,
      "Deadline": this.myTask.Deadline,
      "StartDate": this.myTask.StartDate,
      "Details": this.myTasksForm.value.details
    }
    this.myTasksService.updatetask(this.myTask._id, data).subscribe({
      next: (res) => {
        this._toast.setSuccess(res.message);
      }
    })
    if (this.myTask.Project.progress === 100 && 
      this.myTask.Project.kickoff !== null && 
      this.myTask.Project.build_book !== null && 
      this.myTask.Project.access_document !== null && 
      this.myTask.Project.HLD_LLD !== null) {
 
    this.projectSer.updateStatusToCompleted(this.myTask.Project._id).subscribe({
      next: (res) => {
        this._toast.setSuccess(res.message);
      }
    })
  }
  }
}









