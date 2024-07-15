import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MyProjectsService } from './my-projects.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { SurveyComponent } from '../dashboard/survey/survey/survey.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.sass'],
})
export class MyProjectsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  iduser: any;
  filterToggle = false;
  displayedColumns = [
    'title',
    'clientName',
    'startDate',
    'deadLine',
    'noOfMembers',
    'priority',
    'progress',
    'status',
    'actions',
  ];
  exampleDatabase: MyProjectsService | null;
  dataSource: MatTableDataSource<any[]>;
  id: number;
  f: boolean;

  myProjects: any | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public projectServ: ProjectsService,
    private authServ: AuthService,
    private router : Router
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.iduser = this.authServ.getLoggedUser().id;
    this.projectServ.getmyProject(this.authServ.getLoggedUser().id).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }
  showDetails(project) {
    this.router.navigate(['employee/projectDetails', project._id]);
  }
  toggleStar(row) {
  }
  applyfilter(filter: any) {
    this.dataSource.filter = filter.target.value;
  }
  isNoted(r) {
  }

  isCompleted(row) {
    if (row.note_equipe != null) {
      for (let i = 0; i < row.note_equipe.length; i++) {
        if (row.note_equipe[i].user === this.authServ.getLoggedUser().id) {
          this.f = false;
        }
      }
    }
    else {
      this.f = true;
    }
    if (this.f == false && row.progress == 100 && row.status == 'Completed') {
      return true;
    } else return false;
  }
  Note(row) {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(SurveyComponent, {
      height: '600px',
      width: '800px',
      data: {
        proj: row,
        action: 'add',
      },
      direction: tempDirection,
    });

  }
}
