import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { TasksService } from "../../core/service/tasks.service";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "../../core/service/auth.service";
import { ProjectsService } from "../../core/service/projects.service";
import { SenderService } from "src/app/core/service/sender.service";
import { FormDialogComponent } from "src/app/productowner/tasks/dialogs/form-dialog/form-dialog/form-dialog.component";
import { DeleteComponent } from "src/app/task/dialogs/delete/delete.component";
import { SelectionModel } from "@angular/cdk/collections";
@Component({
  selector: "app-task",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.sass"],
})
export class TasksComponent  extends UnsubscribeOnDestroyAdapter
implements OnInit {

  filter:string
  displayedColumns = [
    "Title",
    "Project",
    "Status",
    "Priority",
    "Executor",
    "Start",
    "Date",
    "Details",
    "Actions",
  ];
  filtredd: any
  project:any[]
  username:String
  user
  dataSource: MatTableDataSource<any[]> ;
  selection = new SelectionModel<any>(true, []);
  index: number;
  id: number;
  myTasks: any | null;
  projects: any[]=[];
  loading:boolean = true  
  nb_closed=0
  nb_open=0
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private taskserv: TasksService,
    private authserv:AuthService,
    private projectserv:ProjectsService,
    private sender :SenderService
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.fetchProjects();
    this.getTasksByTeamLeader();
  }

  fetchProjects(){
    this.projectserv.getProjectsByTeamleader(this.authserv.getLoggedUser().id).subscribe(res=>{
      this.projects = res
    })
  }
  handleProjectSelect(e: any) {
    this.loading = true
    const project_id = e.target.value;
    if (project_id) {
      this.fetchTasksByProjectId(project_id);
    } else {
      this.getTasksByTeamLeader()
    }
  }
  fetchTasksByProjectId(id: string) {
    this.taskserv.getTaskbyproject(id).subscribe({
      next: (res) => {
        this.loading = false
        this.myTasks = res
        this.dataSource=new MatTableDataSource(this.myTasks)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
  getProjectId(project: any): any {
    return project._id;
  }

  getTasksByTeamLeader() {
    this.taskserv.getTasksByTeamLeader(this.authserv.getLoggedUser().id).subscribe({
      next:(res :any)=>{
        if(res){
          this.loading = false
          this.myTasks = res
          this.dataSource=new MatTableDataSource(this.myTasks)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      }}
    })
  }
  applyfilter(filter:any){
    this.dataSource.filter=filter.target.value
  }

  addNew() {
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        myTasks: this.myTasks,
        action: "add",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.dataSource.data = this.dataSource.data.concat(this.sender.task);
        this.refreshTable();
      }
    });
  }
  editCall(row) {
    this.id = row._id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        myTasks: row,
        action: "edit",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.getTasksByTeamLeader();
    });
  }
  deleteItem(i: number, row) {
    this.index = i;
    this.id = row._id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(DeleteComponent, {
      height: "325px",
      width: "400px",
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
  this.dataSource.data=this.dataSource.data.filter((item:any)=>{
    return item._id !==this.id ;
  })


 this.refreshTable();
      }
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  setupFilter(column: string,clo:string,col:string) {
    this.dataSource.filterPredicate = (d: any, filter: string) => {

      const projectName = d.Project.Projectname;
      const useName = d.Executor.fullName;
      const Title = d.Title;
      const Status =d.Status;
      const type=d.Type

      return projectName.indexOf(filter)!==-1 ||useName.indexOf(filter)!==-1||Title.indexOf(filter)!==-1||Status.indexOf(filter)!==-1||type.indexOf(filter)!==-1;
   };
  }

  cal(tab:any[]){
    tab.forEach((item:any)=>{
      if(item.Status=="Open"){
        this.nb_open=this.nb_open+1
      }
      else{
        this.nb_closed++
      }
    })
  }
}
