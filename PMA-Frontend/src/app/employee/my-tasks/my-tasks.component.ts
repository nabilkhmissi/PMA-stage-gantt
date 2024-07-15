import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { FormDialogComponent } from "./dialogs/form-dialog/form-dialog.component";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { MatTableDataSource } from "@angular/material/table";
import { TasksService } from "src/app/core/service/tasks.service";
import { AuthService } from "src/app/core/service/auth.service";
import { Router } from "@angular/router";
import { ProjectsService } from "src/app/core/service/projects.service";

@Component({
  selector: "app-my-tasks",
  templateUrl: "./my-tasks.component.html",
  styleUrls: ["./my-tasks.component.sass"],
})
export class MyTasksComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [

    "Title",
    "project",
    "status",
    "priority",
    "progress",
    "startdate",
    "deadline",
    "actions",
  ];

  dataSource: MatTableDataSource<any> | null;
  index: number;
  id: number;
  loading:boolean = true
  tasks:any[]=[]
  projects:any[]=[]
  myTasks: any | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public myTasksService: TasksService,
    private authSer:AuthService,
    public projectServ: ProjectsService,
    private router:Router
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  ngOnInit() {
    this.projectServ.getmyProject(this.authSer.getLoggedUser().id).subscribe(res=>{
        this.projects = res
    })
    this.myTasksService.getTaskByExecutor(this.authSer.getLoggedUser().id).subscribe({
      next: (data) => {
        this.loading = false
        this.tasks = data
        this.dataSource=new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
  fetchTasksByProjectId(id: string) {
    this.myTasksService.getTaskbyproject(id).subscribe({
      next: (res) => {
        this.loading = false
        this.tasks = res
        this.dataSource=new MatTableDataSource(this.tasks)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
  fetchTasks() {
    this.myTasksService.getTaskByExecutor(this.authSer.getLoggedUser().id).subscribe({
      next: (res) => {
        this.loading = false
        this.tasks = res
        this.dataSource=new MatTableDataSource(this.tasks)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
  refresh() {
    this.myTasksService.getTaskByExecutor(this.authSer.getLoggedUser().id).subscribe({
      next: (data) => {
        this.tasks = data
        this.dataSource=new MatTableDataSource(this.tasks)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
  setupFilter(column: string,clo:string,col:string) {
    this.dataSource.filterPredicate = (d: any, filter: string) => {

      const projectName = d.Project.Projectname;
      const useName = d.Executor.fullName;
      const Title = d.Title;
      const Status =d.Status;
      return projectName.indexOf(filter)!==-1 ||useName.indexOf(filter)!==-1||Title.indexOf(filter)!==-1||Status.indexOf(filter)!==-1;
   };
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
      if (result === 1) {
        const foundIndex = this.dataSource.data.findIndex(
          (x:any) => x._id == this.id
        );
        let t=this.myTasksService.getDialogData()
        let task=[]
        task=this.dataSource.data
        task[foundIndex]=t
        this.dataSource.data=task

        this.refreshTable();
      }
    });
  }

  applyfilter(filter:any){
    this.dataSource.filter=filter.target.value
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  detailsCall(row) {
    this.dialog.open(FormDialogComponent, {
      data: {
        myTasks: row,
        action: "details",
      },
      height: "60%",
      width: "45%",
    });
  }
  kanban(){
    this.router.navigate(["employee/KanbanTasks"]);
  }
}
