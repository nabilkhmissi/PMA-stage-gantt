import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { saveAs } from 'file-saver';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { ReclamationService } from 'src/app/core/service/reclamation.service';
import { TasksService } from 'src/app/core/service/tasks.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.sass']
})
export class ProjectDetailsComponent implements OnInit {
note=0
  projectID:any;
  project:any
  projectTasks:any
  projectReclamation:any
    constructor(private activatedRoute: ActivatedRoute,private projectServ:ProjectsService,private taskServ:TasksService,private reclServ:ReclamationService) {


     this.activatedRoute.paramMap.subscribe({
      next: (p: ParamMap) => {
        this.projectID = p.get('id');
       // console.log(this.projectID);

        this.projectServ.getProject(p.get('id')).subscribe({
          next: (res:any) => {
  this.project=res
 // console.log("fteched",this.project);
  this.getReclamation(this.project)
  this.getTasks(this.project)
this.notecalc(this.project)
          },
          error:(err)=>{console.log(err);
          }



        })

      }}
      )
     }

    ngOnInit(): void {



    }

  getTasks(p:any){

    this.taskServ.getTaskbyproject(p._id).subscribe({
      next:(res)=>{
        this.projectTasks=res
      },
      error:(err)=>{
        console.log(err);

      }
    })
  }

  getReclamation(project:any){
    this.reclServ.getReclamationByProject(project._id).subscribe({
      next:(res)=>{
        this.projectReclamation=res
       // console.log("gagag",this.projectReclamation);

      },
      error:(err)=>{
        console.log(err);
      }

    })
  }


  download(file) {
		this.projectServ.downloadfile(file).subscribe((response: any) => {
			let blob:any = new Blob([response], { type: 'file' });
			const url = window.URL.createObjectURL(blob);
			//window.open(url);
			saveAs(blob, file);
			}), (error: any) => console.log('Error downloading the file'),
			() => console.info('File downloaded successfully');
	}

    notecalc(project:any){
      let sum=0
      project.note_equipe.forEach(n => {

        sum+=n
      });
      this.note=(project.note_Client*0.5 + project.note_Admin*0.25 +sum*0.25)
     // console.log(this.note);

    }
}
