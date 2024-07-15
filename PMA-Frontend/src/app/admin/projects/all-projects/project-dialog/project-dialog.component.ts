import { Component, OnInit, Inject } from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
} from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  ProjectStatus,
  ProjectPriority,
  ProjectType,
} from '../core/project.model';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
})
export class ProjectDialogComponent implements OnInit {
  public project: any;
  public dialogTitle: string;
  public projectForm: UntypedFormGroup;
  public statusChoices: typeof ProjectStatus;
  public priorityChoices: typeof ProjectPriority;
  public projectType: typeof ProjectType;
  private _toast : ToastService
  usr:any
  TeamLeaders: any;
  teamlist: any;
  selected:any[]=[]
  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    private projectServ: ProjectsService,
    private authServ: AuthService
  ) {
    this.dialogTitle = data.title;
    this.project = data.project;
    this.statusChoices = ProjectStatus;
    this.priorityChoices = ProjectPriority;
    this.projectType = ProjectType;
    this.usr=this.authServ.getLoggedUser()

    for(let i=0;i<this.project.equipe.length;i++){
    this.selected.push(this.project.equipe[i]._id);

    }


    this.authServ.getallTeamLeader().subscribe({
      next: (res) => {
        this.TeamLeaders = res;
        this.TeamLeaders = this.TeamLeaders.concat(this.teamlist)
      },
    });
    this.authServ.getAllEngineersAndTeamLeaders().subscribe({
      next: (res) => {
        this.teamlist = res;
      },
    });

    const nonWhiteSpaceRegExp: RegExp = new RegExp('\\S');

    this.projectForm = this.formBuilder.group({
      name: [
        this.project?.Projectname,
        [Validators.required ],
      ],
      status: [this.project.status],
      description: [this.project?.description],
      deadline: [this.project?.dateFin],
      priority: [this.project?.priority],
      Team: [this.selected ,""],
      type: [this.project.type],
      created: [this.project?.dateDebut],
      TeamLeader: [this.project?.TeamLeader ? this.project?.TeamLeader._id :''],
    });
  }

  public ngOnInit(): void {}

  public save(): void {
    if (!this.projectForm.valid) {
      return;
    }
    if (this.project) {
     let formData= new FormData();
      formData.append("Projectname", this.projectForm.value.name)
      formData.append("description", this.projectForm.value.description)
      formData.append("dateFin", this.projectForm.value.deadline)
      formData.append("priority", this.projectForm.value.priority)
      formData.append( "status", this.projectForm.value.status)
      formData.append ("type",this.projectForm.value.type)
      formData.append("equipe", JSON.stringify(this.projectForm.value.Team))

      formData.append("TeamLeader", this.projectForm.value.TeamLeader)

       this.projectServ.updateProject(this.project._id,formData).subscribe({
        next:(res)=>{
          console.log(res);
          this._toast.setSuccess(res.message);
          this.dialogRef.close();
        }
       });
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
