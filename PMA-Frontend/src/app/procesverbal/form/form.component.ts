import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { formatDate } from "@angular/common";
import { ProjectsService } from "src/app/core/service/projects.service";
import { AuthService } from "src/app/core/service/auth.service";
import { ProcesVerbalService } from "src/app/core/service/proces-verbal.service";
import html2pdf from 'html2pdf.js';
import { ToastService } from "src/app/core/service/toast.service";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.sass"],
})
export class FormComponent implements OnInit{
  @ViewChild('pdfContent') pdfContent: ElementRef;
 
  assetsUrl = "https://pma-backend.prologic.com.tn:3002/static/images/"
  action: string;
  dialogTitle: string;
  isDetails = false;
  contactsForm: UntypedFormGroup;
  projects:any
  pv: any;
  users:any
  equipe
  selectedProject:any;
  p:any
  pr:any
  selected:any[]=[]
  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectServ:ProjectsService,
    private procesSer:ProcesVerbalService,
    private fb: UntypedFormBuilder,
    private auhtSer:AuthService,
    private _toast : ToastService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.isDetails = false;
      this.dialogTitle = data.pv.Title;
      this.pv = data.pv;
      this.pr = this.pv.Project
      for(let i=0;i<this.pv.equipe.length;i++){
        this.selected.push(this.pv.equipe[i]._id);
        }

      this.contactsForm = this.createContactForm();
    } else if (this.action === "details") {
      this.pv = data.pv;

      this.isDetails = true;
      this.equipe=this.pv.equipe

    } else {
      this.isDetails = false;
      this.dialogTitle = "New proces Verbal";
      this.pv ={
        "Titre":"",
        "description":"",
         "Date": new Date(),
         "Type_Communication":"",
         "Project": "",
         "Sender": "",
         "equipe":"",
      };
      this.contactsForm = this.createContactForm();
    }
    this.projectServ.getAllProjects().subscribe({
      next :(res)=>{
        this.projects=res
      }
    })
    this.auhtSer.getallEngineer().subscribe({
      next:(res)=>{
        this.users=res
      }
    })
  }

  ngOnInit() {
    this.auhtSer.getUserById(this.pv.Project.client).subscribe(resultat=>{
      this.p=resultat
    })
  }

  formControl = new UntypedFormControl("", [Validators.required]);


  generatePDF() {
    const content = this.pdfContent.nativeElement;
    const options = {
      margin: [10, 10],
      filename: 'PV-pdf.pdf',
      image: { type: 'png' },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
      const pdfContainer = document.createElement('div');
      pdfContainer.appendChild(content);
      html2pdf().from(content).set(options).save();
    }

  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
      ? "Not a valid email"
      : "";
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
     Titre: [this.pv.Titre],
     description: [
        this.pv.description,
      ],
      Date: [
        formatDate(this.pv.Date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      Type_Communication: [this.pv.Type_Communication],
      Project: [this.pv?.Project],
      Sender: [this.pv.Sender],
      equipe: [this.selected],
    });
  }
  submit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {

   let data={
    "Titre":this.contactsForm.value.Titre,
    "description": this.contactsForm.value.description,
     "Date": this.contactsForm.value.Date,
     "Type_Communication": this.contactsForm.value.Type_Communication,
     "Project": this.contactsForm.value.Project._id,
     "Sender":this.auhtSer.getLoggedUser().id,
     "equipe": JSON.stringify(this.contactsForm.value.equipe),
   }

   if(this.action==="add"){
    this.procesSer.addProceVerbal(data).subscribe({
      next:(res)=>{
        this._toast.setSuccess(res.message);
      }
    })
   }
   else if(this.action==="edit"){
    this.procesSer.updateProcesv(this.pv._id,data).subscribe({
      next:(res)=>{
       this._toast.setSuccess(res.message);
      }
    })
   }
  }

  get filteredFormData() {
    if (this.selectedProject) {
      return this.selectedProject.equipe;
    }

  }
}
