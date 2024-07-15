import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormDialogComponent } from 'src/app/admin/reports/dialogs/form-dialog/form-dialog.component';
import { AuthService } from 'src/app/core/service/auth.service';
import { ReclamationService } from 'src/app/core/service/reclamation.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { DeleteComponent } from '../proces-verbal/delete/delete.component';

@Component({
  selector: 'app-client-reclamation',
  templateUrl: './client-reclamation.component.html',
  styleUrls: ['./client-reclamation.component.sass']
})
export class ClientReclamationComponent extends UnsubscribeOnDestroyAdapter
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
  private snackBar: MatSnackBar,
  public dialog: MatDialog,
private reclamServ:ReclamationService
) {
  super();
}

@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
@ViewChild(MatSort, { static: true }) sort: MatSort;
ngOnInit() {
  this.reclamServ.getReclamtionsbyProduct(this.authserv.getLoggedUser().id).subscribe({
    next:(res)=>{
      this.dataSource=new MatTableDataSource(res);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort
    }
  })
}


refresh(): void{
  this.reclamServ.getReclamtionsbyProduct(this.authserv.getLoggedUser().id).subscribe({
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
      const foundIndex = this.dataSource.data.findIndex((x:any) => x._id == this.id);
      let reclamation=[]
      reclamation=this.dataSource.data
      reclamation[foundIndex]=this.reclamServ.getDialogData()
      this.dataSource.data=reclamation
      this.refreshTable()
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

