import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { MatTableDataSource } from "@angular/material/table";
import { RisksService } from "src/app/core/service/risks.service";
import { MatDialog } from "@angular/material/dialog";
import { DeleteRComponent } from "./dialog/delete-r/delete-r.component";


@Component({
  selector: 'app-expense',
  templateUrl: './risks.component.html',
  styleUrls: ['./risks.component.sass'],
})
export class RisksComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  filterToggle = false;
  displayedColumns = [
    "Title",
    "Project",
    "User",
    "Action",
    "Impact",
    "Date",
    "Details",
    "actions",
  ];

  dataSource:  MatTableDataSource<any[]>;
  id: number;
  index: number;
  leaves: any | null;

  constructor(
    public httpClient: HttpClient,
    private riskSer:RisksService,
    public dialog: MatDialog,

  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  ngOnInit() {
   this.riskSer.getAllProblemes().subscribe({
    next:(res)=>{
      this.dataSource= new MatTableDataSource(res);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort
    }
   })
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
    const dialogRef = this.dialog.open(DeleteRComponent, {
      height: "415px",
      width: "390px",
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
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  refresh(): void{
    this.riskSer.getAllProblemes().subscribe({
    next:(res)=>{
      this.dataSource=new MatTableDataSource(res);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort
    }
  })}

  applyfilter(filter:any){
    this.dataSource.filter=filter.target.value
  }
  setupFilter() {
    this.dataSource.filterPredicate = (d: any, filter: string) => {

      const projectName = d.project.Projectname;
      const Action = d.action;
      const Title = d.title;
      const Impact =d.impact;
      const Date=d.date
      const username=d.user.fullName
      return projectName.indexOf(filter)!==-1||Title.indexOf(filter)!==-1||Impact.indexOf(filter)!==-1||Date.indexOf(filter)!==-1||username.indexOf(filter)!==-1||Action.indexOf(filter)!==-1;
    };
  }
}

