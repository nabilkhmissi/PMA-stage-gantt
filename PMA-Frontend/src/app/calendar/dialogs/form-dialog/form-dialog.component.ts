import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
//import { CalendarService } from "../../calendar.service";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { Calendar } from "../../calendar.model";
import { EventService } from "src/app/core/service/event.service";
import { AuthService } from "src/app/core/service/auth.service";
import { ToastService } from "src/app/core/service/toast.service";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  calendarForm: UntypedFormGroup;
  calendar: Calendar;
  showDeleteBtn = false;
  selectedDate : Date;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public eventServ: EventService,
    private fb: UntypedFormBuilder,
    private authserv:AuthService,
    private _toast : ToastService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.calendar.title;
      this.calendar = data.calendar;
      this.selectedDate = data.selectedDate;
      this.showDeleteBtn = true;
    } else {
      this.dialogTitle = "New Event";
      this.calendar = new Calendar({});
      this.showDeleteBtn = false;
    }

    this.calendarForm = this.createContactForm();
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
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
     _id: [this.calendar._id],
      title: [this.calendar.title, [Validators.required]],
      category: [this.calendar.category],
      startDate: [this.data.startDate, [Validators.required]],
      endDate: [this.data.endDate, [Validators.required]],
      details: [this.calendar.details],
      className:this.getClassNameValue(this.calendar.category),
    });
  }
  getClassNameValue(category) {
    let className: string;

    if (category === "Work") className = "fc-event-success";
    else if (category === "Personal") className = "fc-event-warning";
    else if (category === "Important") className = "fc-event-primary";
    else if (category === "Travel") className = "fc-event-danger";
    else if (category === "Friends") className = "fc-event-info";

    return className;
  }
  submit() {
  }
  deleteEvent() {
    this.eventServ.deleteEvent(this.data.calendar.id).subscribe({
      next:(res)=>{
        this._toast.setSuccess(res.message);
      }
    });
    this.dialogRef.close("delete");
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    let data = {
      title: this.calendarForm.value.title,
      category: this.calendarForm.value.category,
      startDate: this.calendarForm.value.startDate,
      endDate: this.calendarForm.value.endDate,
      details: this.calendarForm.value.details,
      className: this.getClassNameValue(this.calendarForm.value.category),
      user:this.authserv.getLoggedUser().id
    };
    if(this.action ==="add"){
    this.eventServ.addEvent(data).subscribe({
      next: (res) => {
        this._toast.setSuccess(res.message);
      },
    });}
    else if(this.action ==="edit"){
      this.eventServ.updatEvent(this.data.calendar.id,data).subscribe({
        next:(res)=>{
          this._toast.setSuccess(res.message);
        }
      })
    }
    this.dialogRef.close('submit');
}}
