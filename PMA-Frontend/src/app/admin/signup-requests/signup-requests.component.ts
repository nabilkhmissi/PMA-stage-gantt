import { Component, OnInit, ViewChild } from "@angular/core";
import { LeadsService } from "./leads.service";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Leads } from "./leads.model";
import { MatMenuTrigger } from "@angular/material/menu";
import { DeleteDialogComponent } from "./dialogs/delete/delete.component";
import { SelectionModel } from "@angular/cdk/collections";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { AuthService } from "src/app/core/service/auth.service";
import { ConfrimComponent } from "./dialogs/confrim/confrim.component";
import { MatTableDataSource } from "@angular/material/table";
import { UtilsService } from "src/app/core/service/utils.service";

@Component({
  selector: 'app-signup-requests',
  templateUrl: './signup-requests.component.html',
  styleUrls: ['./signup-requests.component.sass'],
})
export class SignupRequestsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    "select",
    "img",
    "name",
    "role",
    "mobile",
    "email",
    "actions",
  ];
  filter:string
  dataSource: MatTableDataSource<any[]> ;
  selection = new SelectionModel<any>(true, []);
  index: number;
  id: number;
  leads: Leads | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public leadsService: LeadsService,
    private authService:AuthService,private utils:UtilsService
  ) {
    super();
    this.authService.getAllSignupRequests().subscribe({
      next:(res)=>{
        this.dataSource=new MatTableDataSource(res);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
      }
    })
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  ngOnInit() {
  }
  refresh() {
  }

  tobas64(pic){
    return this.utils.base64ToPic(pic);
  }
  editCall(row) {
    this.id = row.id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(ConfrimComponent, {
      height: "300",
      width: "400px",
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.reefresh();
      }
    });}

    search(filter:any){
     this.dataSource.filter=filter.target.value
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
      height: "320px",
      width: "400px",
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.reefresh();
      }
    });}
    onContextMenu(event: MouseEvent, item: Leads) {
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + "px";
      this.contextMenuPosition.y = event.clientY + "px";
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem("mouse");
      this.contextMenu.openMenu();
    }

reefresh(){
  this.authService.getAllSignupRequests().subscribe({
    next:(res)=>{
      this.dataSource=new MatTableDataSource(res);
      this.filter=""
    }
  })
}
  }


