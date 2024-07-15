import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { ProjectStatus, ProjectPriority, ProjectType } from '../../../admin/projects/all-projects/core/project.model';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.sass']
})
export class ProjectDialogComponent {
  public project: any;
  public dialogTitle: string;
  public projectForm: UntypedFormGroup;
  public statusChoices: typeof ProjectStatus;
  public priorityChoices: typeof ProjectPriority;
  public projectType: typeof ProjectType;
  usr: any
  TeamLeaders: [];
  teamlist: [];
  selected: any[] = [];
  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    private projectServ: ProjectsService,
    private authServ: AuthService,
    private _toast : ToastService,
  ) {
    this.dialogTitle = data.title;
    this.project = data.project;
    this.statusChoices = ProjectStatus;
    this.priorityChoices = ProjectPriority;
    this.projectType = ProjectType;
    this.usr = this.authServ.getLoggedUser()

    for (let i = 0; i < this.project.equipe.length; i++) {
      this.selected.push(this.project.equipe[i]._id);
    }


    this.authServ.getallTeamLeader().subscribe({
      next: (res) => {
        this.TeamLeaders = res;
      },
    });
    this.authServ.getEngineer().subscribe({
      next: (res) => {
        this.teamlist = res;
      },
    });

    const nonWhiteSpaceRegExp: RegExp = new RegExp('\\S');

    this.projectForm = this.formBuilder.group({

      type: [""],

      File: [""],

    });
  }

  public ngOnInit(): void { }

  public save(): void {
    if (!this.projectForm.valid) {
      return;
    }
    if (this.project) {

      let formData = new FormData();

      formData.append("file", this.projectForm.value.File, this.projectForm.value.File.name)
      if (this.projectForm.value.type == "Kick Off") {
        this.projectServ.addkik(this.project._id, formData).subscribe({
          next: (res) => {
           this._toast.setSuccess(res.message);
          }
        })

      }
      else if (this.projectForm.value.type == "Build Book") {
        this.projectServ.addbuild(this.project._id, formData).subscribe({
          next: (res) => {
            this._toast.setSuccess(res.message);
          }
        })
      }
      else if (this.projectForm.value.type == "Access Document") {
        this.projectServ.addaccesd(this.project._id, formData).subscribe({
          next: (res) => {
            this._toast.setSuccess(res.message);
          }
        })
      }
      else if (this.projectForm.value.type == "HLD-LLD") {
        this.projectServ.addHLDLLD(this.project._id, formData).subscribe({
          next: (res) => {
            this._toast.setSuccess(res.message);

          }
        })
      }
      else if (this.projectForm.value.type == "Other") {
        this.projectServ.addOther(this.project._id, formData).subscribe({
          next: (res) => {
            this._toast.setSuccess(res.message);

          }
        })
      }
      else if (this.projectForm.value.type == "Additional-1") {
        this.projectServ.addOther1(this.project._id, formData).subscribe({
          next: (res) => {
            this._toast.setSuccess(res.message);

          }
        })
      }
      else if (this.projectForm.value.type == "Additional-2") {
        this.projectServ.addOther2(this.project._id, formData).subscribe({
          next: (res) => {
            this._toast.setSuccess(res.message);

          }
        })
      }
      else if (this.projectForm.value.type == "Additional-3") {
        this.projectServ.addOther3(this.project._id, formData).subscribe({
          next: (res) => {
            this._toast.setSuccess(res.message);

          }
        })
      }
      this.dialogRef.close();
    } else {
      this._toast.setSuccess("Project created successfully");

      this.dialogRef.close();
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
