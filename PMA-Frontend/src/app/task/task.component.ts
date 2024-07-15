import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormDialogComponent } from "./dialogs/form-dialog/form-dialog.component";
import { DeleteComponent } from "./dialogs/delete/delete.component";
import { SelectionModel } from "@angular/cdk/collections";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { TasksService } from "../core/service/tasks.service";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "../core/service/auth.service";
import { ProjectsService } from "../core/service/projects.service";
import { Executor } from "selenium-webdriver";
import { User } from "../core/models/user";
import { environment } from "src/environments/environment";
import { map } from "rxjs";
@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.sass"],
})

export class TaskComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  serverImageUrl = `${environment.apiUrl}/static/images`
  filter: string
  displayedColumns = [
    "Title",
    "Project",
    //"client",
    "Status",
    //"Type",
    "Priority",
    "Executor",
    "Date",
    "Deadline",
    "Details",
    "Actions",
  ];
  loading: boolean = true
  username: String
  user
  dataSource: MatTableDataSource<any[]>;
  selection = new SelectionModel<any>(true, []);
  index: number;
  id: number;
  executors: any[]
  tasks: any[]
  Allprojects: any[]
  taskExecutor: any[]
  TE: User[]
  myTasks: any | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private taskserv: TasksService,
    private snackBar: MatSnackBar,
    private authserv: AuthService,
    private projectserv: ProjectsService
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.fetchProjects()
    this.fetchTasks();
  }
  refresh() {
    this.taskserv.getAll().subscribe({
      next: (res) => {
        if (res) {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort
          this.filter = ""
        }
      },
      error: (err) => {
        console.log(err);

      }
    })
  }
  applyfilter(filter: any) {
    this.dataSource.filter = filter.target.value

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
        this.dataSource.data = this.dataSource.data.concat(this.taskserv.getDialogData())
        this.refreshTable();
        this.showNotification(
          "snackbar-success",
          "Add task Successfully...!!!",
          "bottom",
          "center"
        );
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
      if (result === 1) {
        const foundIndex = this.dataSource.data.findIndex(
          (x: any) => x._id == this.id
        );
        let tasks = []
        tasks = this.dataSource.data

        tasks[foundIndex] = this.taskserv.getDialogData()
        this.dataSource.data = tasks
        this.refreshTable()
        this.showNotification(
          "snackbar-success",
          "Edit task Successfully...!!!",
          "bottom",
          "center"
        );
      }
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
      height: "270px",
      width: "400px",
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.dataSource.data = this.dataSource.data.filter((item: any) => {
          return item._id !== this.id;
        });

        this.refreshTable();
        this.showNotification(
          "snackbar-danger",
          "Delete Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */


  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  getuser(id) {
    this.authserv.getUserById(id).subscribe({
      next: (res) => {
        // console.log(res);

      }
    })

  }
  getuserby(id) {
    this.authserv.getUserById(id).subscribe({
      next: (res) => {
        this.user = res
      },
      error: (err) => {
        console.log(err);

      }
    })
    return this.user.fullName;
  }

  fetchProjects() {
    this.projectserv.getAllProjects().subscribe({
      next: (res: any[]) => {
        this.Allprojects = res
      }
    })
  }
  fetchTasksByProjectId(id: string) {
    this.taskserv.getTaskbyproject(id).subscribe({
      next: (res) => {
        this.loading = false
        this.tasks = res
      }
    })
  }
  fetchTasks() {
    this.taskserv.getAll().subscribe({
      next: (res) => {
        this.loading = false
        this.tasks = res
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
}
