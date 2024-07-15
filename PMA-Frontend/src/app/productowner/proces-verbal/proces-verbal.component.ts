import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProcesVerbalService } from 'src/app/core/service/proces-verbal.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { DeleteComponent } from './delete/delete.component';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-proces-verbal',
  templateUrl: './proces-verbal.component.html',
  styleUrls: ['./proces-verbal.component.sass']
})
export class ProcesVerbalComponent extends UnsubscribeOnDestroyAdapter
implements OnInit
{
  filterToggle = false;
  displayedColumns = [

    "Titre",
    "description",
    "Project",
    "Type_Communication",
    "Sender",
    "Present",
    "actions",
  ];

  dataSource: MatTableDataSource<any[]>;

  id: number;
  pv: any | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private authSer:AuthService,
    private procesServ:ProcesVerbalService,
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  ngOnInit() {
  this.procesServ.getProcesByUser(this.authSer.getLoggedUser().id).subscribe({
    next :(res)=>{
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  })
  }
  refresh() {
    this.procesServ.getProcesByUser(this.authSer.getLoggedUser().id).subscribe({
      next :(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  setupFilter() {
    this.dataSource.filterPredicate = (d: any, filter: string) => {

      const projectName = d.Project.Projectname;
      const Action = d.description;
      const Title = d.Titre;
      const Type_Communication =d.Type_Communication;
      const username=d.Sender.fullName

      // Return true if the project name contains the filter value
      return projectName.indexOf(filter)!==-1||Title.indexOf(filter)!==-1||Type_Communication.indexOf(filter)!==-1||username.indexOf(filter)!==-1||Action.indexOf(filter)!==-1;
  /*       return textToSearch.indexOf(filter) !== -1;
  */    };
  }
  addNew() {
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(FormComponent, {
      data: {
        contacts: this.pv,
        action: "add",
      },

      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.refreshTable();
      if (result === 1) {
        this.dataSource.data= this.dataSource.data.concat(this.procesServ.getDialogDate())
      }
    });
  }
  detailsCall(row) {
    this.dialog.open(FormComponent, {
      data: {
        pv: row,
        action: "details",
      },
      height: "75%",
      width: "35%",
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
    const dialogRef = this.dialog.open(FormComponent, {
      data: {
        pv: row,
        action: "edit",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.dataSource.data.findIndex(
          (x:any) => x._id == this.id
        );

        let procev=[]
        procev=this.dataSource.data

        procev[foundIndex]=this.procesServ.getDialogDate()
        this.dataSource.data=procev
        this.refreshTable();
      }
    });
  }
  applyfilter(filter:any){
    this.dataSource.filter=filter.target.value
  }
  deleteItem(row) {
    this.id = row._id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(DeleteComponent, {
      height: "370px",
      width: "409px",
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
}