import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { FormDialogComponent } from "./dialog/form-dialog/form-dialog.component";
import { DeleteDialogComponent } from "./dialog/delete/delete.component";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { ClientsService } from "./clients.service";
import { Clients } from "./clients.model";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "src/app/core/service/auth.service";
@Component({
  selector: "app-all-clients",
  templateUrl: "./all-clients.component.html",
  styleUrls: ["./all-clients.component.sass"],
})
export class AllclientComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    "img",
    "name",
    "mobile",
    "email",
    "company_name",
    "actions",
  ];
  dataSource: MatTableDataSource<any[]>  |  [];
  filter:string

  index: number;
  id: number;
  clients: Clients | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public clientService: ClientsService,
    private authService :AuthService

  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
   this.authService.getallCient().subscribe({
    next:(res)=>{
      this.dataSource=new MatTableDataSource(res);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
    }
   })
  }
  refresh() {
   this.authService.getallCient().subscribe({
    next:(res)=>{
      this.dataSource=new MatTableDataSource(res);
      this.filter=""
    }
   })
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
        clients: this.clients,
        action: "add",
      },
      direction: tempDirection,
    });
  }
  editCall(row) {
    this.id = row.id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        clients: row,
        action: "edit",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.ngOnInit();
        this.refreshTable();
      }
    });
  }
  deleteItem(i: number, row) {
    this.index = i;
    this.id = row.id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      height: "300px",
      width: "420px",
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {

      this.refresh()
        this.refreshTable();
      }
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  applyfilter(filter:any){
    this.dataSource.filter=filter.target.value
  }
}

