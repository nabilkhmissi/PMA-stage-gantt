import { Component,  OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "src/app/core/service/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { ReclamationService } from "src/app/core/service/reclamation.service";
import { FormDialogComponent } from "../dialogs/form-dialog/form-dialog.component";
import { DeleteComponent } from "../dialogs/delete/delete.component";

@Component({
  selector: 'app-reclamations',
  templateUrl: './reclamations.component.html',
  styleUrls: ['./reclamations.component.sass'],
})
export class ReclamationsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  filterToggle = false;
  displayedColumns = [
    "Title",
    "Type Reclamation",
    "Project Title",
    "date of creation",
    "client",
    "status",
    "Comment",
    "Actions"

  ];


  dataSource:  MatTableDataSource<any[]>;
  id: number;
  index: number;

  reclamation: any | null;
  constructor(
    public httpClient: HttpClient,
    private authserv:AuthService,
    public dialog: MatDialog,
    private reclamServ:ReclamationService
  ) {
    super();
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.reclamServ.getAllReclamations().subscribe({
      next:(res)=>{
        this.dataSource=new MatTableDataSource(res);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort
      }
    })
  }

  refresh(): void{
    this.reclamServ.getAllReclamations().subscribe({
    next:(res)=>{
      this.dataSource=new MatTableDataSource(res);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort
    }
  })}
  setupFilter() {
    this.dataSource.filterPredicate = (d: any, filter: string) => {

      const projectName = d.project.Projectname;
      const Title = d.Title;
      const Impact =d.Type_Reclamation;
      const Status=d.status
      const username=d.client.fullName
      return projectName.indexOf(filter)!==-1||Title.indexOf(filter)!==-1||Impact.indexOf(filter)!==-1||Status.indexOf(filter)!==-1||username.indexOf(filter)!==-1;
    };
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
        reclamation: this.reclamation,
        action: "add",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
       this.dataSource.data= this.dataSource.data.concat(this.reclamServ.getDialogData())
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
        reclamation: row,
        action: "edit",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.dataSource.data.findIndex(
          (x:any) => x._id == this.id
        );
        let reclamation=[]
        reclamation=this.dataSource.data
        reclamation[foundIndex]=this.reclamServ.getDialogData()
        this.dataSource.data=reclamation

        this.refreshTable()
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
      height: "50%",
      width: "50%",
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


  applyfilter(filter:any){
    this.dataSource.filter=filter.target.value
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}
