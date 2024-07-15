import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { FormDialogComponent } from "./dialogs/form-dialog/form-dialog.component";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { DeleteComponent } from "./dialogs/delete/delete.component";
import { MatTableDataSource } from "@angular/material/table";
import { ProjectsService } from "src/app/core/service/projects.service";
import { AuthService } from "src/app/core/service/auth.service";
import { DialogNoteComponent } from "./dialogs/dialog-note/dialog-note.component";
import { Router } from "@angular/router";
import { SenderService } from "src/app/core/service/sender.service";
import { AddfileComponent } from "./dialogs/addfile/addfile.component";
@Component({
  selector: "app-myprojects",
  templateUrl: "./my-projects.component.html",
  styleUrls: ["./my-projects.component.sass"],
})
export class MyProjectsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    "Project Name",
    "type",
    "Deadline",
    "Note",
    "progress",
    "status",
    "actions",
  ];
  dataSource: MatTableDataSource<any[]> | null;
  index: number;
  id: number;
  myProject: any | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public projectServ: ProjectsService,
    private authSer:AuthService,
    private router :Router,
    private sender:SenderService,
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  ngOnInit() {
    this.projectServ.getprojectbyClient(this.authSer.getLoggedUser().id).subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
      }
    })
  }
  refresh() {
    this.projectServ.getprojectbyClient(this.authSer.getLoggedUser().id).subscribe({
      next: (response) => {
      this.dataSource=new MatTableDataSource(response);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
      }
    })
  }
  rate(row){
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(DialogNoteComponent, {
      data: {
        myProjects: row,
        action: "edit",
      },
      direction: tempDirection,
      width:" 60%",
      height: "70%",
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {

        this.refresh()
        this.refreshTable();
      }})
  }

  addfile(row){
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(AddfileComponent, {
      data: {
        project:row,
        action: "add",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.refreshTable();
      }
    });
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
        user: this.authSer.getLoggedUser(),
        action: "add",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        setTimeout(() => {console.log("bbbbbb",this.sender.project);

        this.dataSource.data = this.dataSource.data.concat(this.sender.project)},1000)
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
        myProjects: row,
        action: "edit",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.dataSource.data.findIndex(
          (x:any) => x._id == this.id
        );

        let proj=[]
        proj=this.dataSource.data

        proj[foundIndex]=this.projectServ.getDialogData()
        this.dataSource.data=proj
        this.refreshTable();
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
      height: "360px",
      width: "400px",
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.dataSource.data=this.dataSource.data.filter((item:any)=>{
          return item._id !== this.id;
         });
         this.refreshTable();
      }
    });
  }
  showDetails(row){
    this.router.navigate(["client/projects/projectDetails",row._id])
  }



  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  applyfilter(filter:any){
    this.dataSource.filter=filter.target.value
  }
  checkp(row){
    if((row.status==="Completed" &&  row.progress===100) ){
      this.rate(row)
    }
  }
}

