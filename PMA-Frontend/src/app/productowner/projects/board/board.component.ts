import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProjectDialogComponent } from 'src/app/admin/projects/all-projects/project-dialog/project-dialog.component';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProjectsService } from 'src/app/core/service/projects.service';
import {  ProjectStatus } from "../core/project.model";
import {ProjectDialogComponent as filedialog} from '../project-dialog/project-dialog.component'
import { map } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit{

  public lists: object;
  constructor(
    private dialog: MatDialog,
    private projectServ:ProjectsService,
    private router:Router,
    private authServ:AuthService,
    private _toast : ToastService

  ) {
    this.lists = {};
    
  }
  new_projects = [];
  in_progess = [];
  on_hold = [];
  completed = [];
  new_projects_count = 1;
  in_progress_count = 1;
  on_hold_count = 1;
  completed_count = 1;

  new_projects_length = 0;
  in_progress_length = 0;
  on_hold_length = 0;
  completed_length = 0;
  public ngOnInit(): void {
    this.getProjects()
   }

   public editProjectDialog(project: any): void {
    this.dialogOpen("Edit project", project);


  }

  private dialogOpen(title: string, project: any = null): void {
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef=this.dialog.open(ProjectDialogComponent, {
      height: "85%",
      width: "55%",
      autoFocus: true,
      data: {
        title,
        project,
      },
      direction: tempDirection,
    });
    dialogRef.afterClosed().subscribe({
      next:(res)=>{
        this.getProjects();
        this._toast.setSuccess("Project status updated")
      }
    })


  }
  addfile(project:any){
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }

    const dialogRef=this.dialog.open(filedialog, {
      height: "50%",
      width: "55%",
      autoFocus: true,
      data: {
        project,
      },
      direction: tempDirection,
    });
    dialogRef.afterClosed().subscribe({
      next:(res)=>{
        setTimeout(() => { location.reload()},1000)
      }
    })
  }

   getProjects(){
    this.projectServ.getProjectsByTeamleader(this.authServ.getLoggedUser().id).pipe(map((projects: any[]) => {
      return {
        NEWPROJECT: projects.filter(
          (project) => project.status === ProjectStatus.NEWPROJECT
        ),
        INPROGRESS: projects.filter(
          (project) => project.status === ProjectStatus.INPROGRESS
        ),
        ONHOLD: projects.filter(
          (project) => project.status === ProjectStatus.ONHOLD
        ),
        COMPLETED: projects.filter(
          (project) => project.status === ProjectStatus.COMPLETED
        ),
      };
    })).subscribe((response) => {
      this.new_projects = response["NEWPROJECT"];
      this.in_progess = response["INPROGRESS"];
      this.on_hold = response["ONHOLD"];
      this.completed = response["COMPLETED"];

      this.in_progress_length = this.in_progess.length;
      this.on_hold_length = this.on_hold.length;
      this.completed_length = this.completed.length;
      this.new_projects_length = this.new_projects.length;

      this.lists = {
        NEWPROJECT: this.new_projects.slice(0, this.new_projects_count),
        INPROGRESS: this.in_progess.slice(0, this.in_progress_count),
        ONHOLD: this.on_hold.slice(0, this.on_hold_count),
        COMPLETED: this.completed.slice(0, this.completed_count),
      };
    });
  
  }
  public unsorted(): void {
    // empty function to pass as an argument to keyvalue pipe in template
  }
  public drop(event: CdkDragDrop<string[]>): void {
    if ((event.previousContainer !== event.container) &&(event.previousContainer.id!="ONHOLD")){
      const project = event.item.data;
      if ((ProjectStatus[event.container.id] === 'Completed')&&(project.kickoff!=null)&&(project.HLD_LLD!=null)&&(project.build_book!=null)&&(project.access_document!=null)) {

        project.status = ProjectStatus[event.container.id];
        project.progress = 100;
      } else if((ProjectStatus[event.container.id] === 'On Hold')||(ProjectStatus[event.container.id] === 'Pending')||(ProjectStatus[event.container.id] === 'In Progress')){
        project.status = ProjectStatus[event.container.id];
      }
      this.projectServ.updateStatus(project._id, project).subscribe({
        next: (res) => {
          this._toast.setSuccess(res.message);
        },
      });
    }
  }
  showDetails(project){
   this.router.navigate(["TeamLeader/projectDetails",project._id])
  }
  getColor(k){
      if(k=="NEWPROJECT"){
        return "col-red"
      }
      else if(k=="INPROGRESS")
      { return "col-blue"}
      else if(k=="ONHOLD")
      { return "col-orange"}
      else if(k=="COMPLETED")
      { return "col-green"}

    }

    handleShowMore(status: string) {
      switch (status) {
        case "NEWPROJECT":
          this.new_projects_count++;
          break;
        case "COMPLETED":
          this.completed_count++;
          break;
        case "ONHOLD":
          this.on_hold_count++;
          break;
        case "INPROGRESS":
          this.in_progress_count++;
          break;
      }
      this.getProjects();
    }
  
    
  
  
    showMoreButtonCheck(data: any[], status: string) {
      switch (status) {
        case "INPROGRESS":
          return this.in_progess.length == data.length
          break;
        case "ONHOLD":
          return this.on_hold.length == data.length
          break;
        case "COMPLETED":
          return this.completed.length == data.length
          break;
        case "NEWPROJECT":
          return this.new_projects_length == data.length
          break;
      }
    }
}
