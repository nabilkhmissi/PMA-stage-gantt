import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/core/service/auth.service';
import { RisksService } from 'src/app/core/service/risks.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { DeleteComponent } from './dialogs/delete/delete.component';
import { FormsComponent } from './dialogs/forms/forms.component';

@Component({
  selector: 'app-risks',
  templateUrl: './risks.component.html',
  styleUrls: ['./risks.component.sass']
})
export class RisksComponent  extends UnsubscribeOnDestroyAdapter
implements OnInit
{
displayedColumns = [
  "Title",
  "project",
  "Action",
  "impact",
  "date",
  "details",
  "actions",
];

dataSource: MatTableDataSource<any> | null;
index: number;
id: number;
myRisks: any | null;
  subs: any;
constructor(
  public httpClient: HttpClient,
  public dialog: MatDialog,
  public myRiskServ: RisksService,
  private snackBar: MatSnackBar,
  private authSer:AuthService
) {
  super();
}
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
@ViewChild(MatSort, { static: true }) sort: MatSort;
@ViewChild("filter", { static: true }) filter: ElementRef;
ngOnInit() {
  this.myRiskServ.getProbyUSer(this.authSer.getLoggedUser().id).subscribe({
    next: (data) => {
      this.dataSource=new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  })
}
refresh() {
  this.myRiskServ.getProbyUSer(this.authSer.getLoggedUser().id).subscribe({
    next: (data) => {
      this.dataSource=new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  })
}
setupFilter(column: string,clo:string,col:string) {
  this.dataSource.filterPredicate = (d: any, filter: string) => {

    const projectName = d.project.Projectname;
    const Title = d.title;
    const Impact =d.Impact;
    const Date=d.Date

    return projectName.indexOf(filter)!==-1||Title.indexOf(filter)!==-1||Impact.indexOf(filter)!==-1||Date.indexOf(filter)!==-1};
}
addNew() {
  let tempDirection;
  if (localStorage.getItem("isRtl") === "true") {
    tempDirection = "rtl";
  } else {
    tempDirection = "ltr";
  }
  const dialogRef = this.dialog.open(FormsComponent, {
    data: {
      myRisks: this.myRisks,
      action: "add",
    },
    direction: tempDirection,
  });
  this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    if (result === 1) {
     this.dataSource.data= this.dataSource.data.concat(this.myRiskServ.getDialogData())
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
  const dialogRef = this.dialog.open(FormsComponent, {
    data: {
      myRisks: row,
      action: "edit",
    },
    direction: tempDirection,
  });
  this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    if (result === 1) {
      const foundIndex = this.dataSource.data.findIndex(
        (x:any) => x._id == this.id
      );
      let risks=[]
      risks=this.dataSource.data
      risks[foundIndex]=this.myRiskServ.getDialogData()
      this.dataSource.data=risks
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

applyfilter(filter:any){
  this.dataSource.filter=filter.target.value
}

private refreshTable() {
  this.paginator._changePageSize(this.paginator.pageSize);
}
}
