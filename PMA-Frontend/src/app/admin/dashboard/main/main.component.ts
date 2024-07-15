import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { map, tap } from "rxjs";
import { AuthService } from "src/app/core/service/auth.service";
import { ProjectsService } from "src/app/core/service/projects.service";
import { ReclamationService } from "src/app/core/service/reclamation.service";
import { TasksService } from "src/app/core/service/tasks.service";
import { environment } from "src/environments/environment";


@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  loading: boolean = true

  serverImageUrl = `${environment.apiUrl}/static/images`;

  lastTenYears = [];
  public barChartOptions: any;
  public barChartOptions1: any;

  displayedColumns = [
    "Title",
    "Type Reclamation",
    "Project Title",
    "date of creation",
    "client",
    "status",
  ];
  projectsCount: number
  Allprojects: any;
  nb_client = 0
  nb_employe = 0
  nb_product = 0
  reclamations: any;


  users: any;
  engineerNames = []
  projects_count_engineer = []
  TeamLeaderNames = []
  projects_count_TeamLeader = []
  tasks: any;
  constructor(private projectServ: ProjectsService,
    private Authserv: AuthService,
    private Taskserv: TasksService,
    private reclamationService: ReclamationService,
    private router: Router) {
    this.getLastTenYears();
  }
  ngOnInit() {
    this.fetchProjects();
    this.fetchTeamLeadersParticipations();
    this.fetchEngineersParticipations();
    this.fetchTasks();
    this.fetchUsers();
    this.fetchPendingClaims();
  }

  fetchTasks() {
    this.Taskserv.getAll().subscribe({
      next: (res) => {
        this.loading = false
        this.tasks = res
      }
    })
  }
  fetchProjects() {
    this.projectServ.getAllProjects().subscribe({
      next: (res: any[]) => {
        this.projectsCount = res.length
        this.Allprojects = res.sort((x, y) => x.note_Client - y.note_client)
        this.cal(this.users)
      }
    })
  }
  fetchUsers() {
    this.Authserv.getallUsers().subscribe({
      next: (res) => {
        this.users = res;
      }
    })
  };

  fetchPendingClaims() {
    this.reclamationService.getAllReclamationsPending().subscribe(
      res => {
        this.reclamations = res;
      }
    )
  }

  fetchTasksByProjectId(id: string) {
    this.Taskserv.getTaskbyproject(id).subscribe({
      next: (res) => {
        this.loading = false
        this.tasks = res
      }
    })
  }
  fetchEngineersParticipations() {
    this.projectServ.getEngineersParticipations().pipe(
      map((data: any[]) => data.sort((a, b) => b.projects - a.projects)),
      tap((res: any) => {
        res.forEach((element: any) => {
          this.projects_count_engineer.push(element.projects);
          this.engineerNames.push(element.user.fullName);
          this.barChart();
        });
      })
    ).subscribe();
  }
  fetchTeamLeadersParticipations() {
    this.projectServ.getTeamLeadersParticipations().pipe(
      map((data: any[]) => data.sort((a, b) => b.projects - a.projects)),
      tap((res: any) => {
        res.forEach((element: any) => {
          this.projects_count_TeamLeader.push(element.projects);
          this.TeamLeaderNames.push(element.user.fullName);
          this.barChart1();
        });
      })
    ).subscribe();
  }

  cal(tab: any[]) {
    if (tab) {
      tab.forEach((item: any) => {
        if (item.roles[0] === "Client") {
          this.nb_client++
        }
        else if (item.roles[0] === "Team Leader") {
          this.nb_product++
        }
        else if (item.roles[0] === "Engineer") {
          this.nb_employe++;
        }
      })
    }
  }

  public getColor(index: number): string {
    switch (index) {
      case 0: return " col-blue"
      case 1: return " col-green"
      case 2: return "col-orange"
      case 3: return "col-purple"
      //case 4: return "bg-green"
      case 3: return "bg-red"
      default: return "bg-green"
    }
  }
  /* ============== participations chart ================= */
  private barChart() {
    this.barChartOptions = {
      series: [{
        data: this.projects_count_engineer
      }],
      chart: {
        id: 'EN',
        type: 'bar',
        height: 500
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: this.engineerNames,
      }
    }
  }
  
  private barChart1() {
    this.barChartOptions1 = {
      series: [{
        data: this.projects_count_TeamLeader
      }],
      chart: {
        id: 'TL',
        type: 'bar',
        height: 250
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: this.TeamLeaderNames,
      }
    }
  }
  getLastTenYears() {
    const currentYear = new Date().getFullYear();
    for (let i = 10; i > -1; i--) {
      this.lastTenYears.push(currentYear - i);
    }
    this.lastTenYears.sort((a, b) => b - a)
  }

  handleYearSelect(e: any) {
    this.loading = true
    this.projectServ.getAllProjects(e.target.value).subscribe({
      next: (res) => {
        this.loading = false
        this.Allprojects = res
      }
    })
  }
  handleProjectSelect(e: any) {
    this.loading = true
    const project_id = e.target.value;
    if (project_id) {
      this.fetchTasksByProjectId(project_id);
    } else {
      this.fetchTasks();
    }
  }
  handleProjectSearch(event : any){
    const search:string = event.target.value;
    if(search.length > 0){
      this.Allprojects = this.Allprojects.filter(project => project.Projectname.toLowerCase().includes(search.toLowerCase()))
    }else{
      this.fetchProjects();
    }
  }
  handleProjectByClientSearch(event : any){
    const search:string = event.target.value;
    if(search.length > 0){
      this.Allprojects = this.Allprojects.filter(project => project.client.fullName.toLowerCase().includes(search.toLowerCase()))
    }else{
      this.fetchProjects();
    }
  }
  redirect(pid){
    this.router.navigate(["/admin/projects/projectDetails/"+pid])
  }
}
