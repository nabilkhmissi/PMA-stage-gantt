import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/service/auth.service";
import { ProjectsService } from "src/app/core/service/projects.service";

@Component({
  selector: "app-myteam",
  templateUrl: "./myteam.component.html",
  styleUrls: ["./myteam.component.sass"],
})
export class MyTeamsComponent implements OnInit {
  public projects: any;
  id:any
  constructor(private authServ:AuthService,private projectServ:ProjectsService) {}

  ngOnInit(): void {
    this.id=this.authServ.getLoggedUser().id;
    this.projectServ.getmyProject(this.authServ.getLoggedUser().id).subscribe({
      next:(res:any)=>{
        this.projects=res;
      }
    })
  }
}
