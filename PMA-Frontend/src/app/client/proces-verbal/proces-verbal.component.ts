import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Project } from 'src/app/admin/projects/all-projects/core/project.model';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProcesVerbalService } from 'src/app/core/service/proces-verbal.service';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { FormComponent } from 'src/app/procesverbal/form/form.component';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';


@Component({
  selector: 'app-proces-verbal',
  templateUrl: './proces-verbal.component.html',
  styleUrls: ['./proces-verbal.component.sass']
})
export class ProcesVerbalComponent extends UnsubscribeOnDestroyAdapter
implements OnInit
{
  idProject:string
  project:Project[]
  filterToggle = false;
  displayedColumns = [

    "Titre",
    "description",
    "Project",
    "Type_Communication",
    "Sender",
    "Present",
  ];

  dataSource: MatTableDataSource<any[]>;

  id: number;
  pv: any | null;
  
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private authSer:AuthService,
    private procesServ:ProcesVerbalService,
    private projectServ:ProjectsService,
    private snackBar: MatSnackBar
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
  this.projectServ.getprojectbyClient(this.authSer.getLoggedUser().id).subscribe({
    next :(res)=>{
      for(let i=0 ; i<res.length;i++){
        this.project= res[i]
      }
      this.idProject=this.project["_id"]
      this.procesServ.getProcesByProject(this.idProject).subscribe({
        next :(res)=>{
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      })
      
    }
  })
  
  }
  
  refresh() {
    this.procesServ.getProcesByProject(this.idProject).subscribe({
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

      return projectName.indexOf(filter)!==-1||Title.indexOf(filter)!==-1||Type_Communication.indexOf(filter)!==-1||username.indexOf(filter)!==-1||Action.indexOf(filter)!==-1;
   };
  }

  detailsCall(row) {
    this.dialog.open(FormComponent, {
      data: {
        pv: row,
        action: "details",
      },
      height: "75%",
      width: "50%",
    });
  }
  toggleStar(row) {
  }
  applyfilter(filter:any){
    this.dataSource.filter=filter.target.value
  }
}