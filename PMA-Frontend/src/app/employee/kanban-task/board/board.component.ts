import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/service/auth.service';
import { TasksService } from 'src/app/core/service/tasks.service';
import { TaskStatus } from '../core/task.model';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.sass'],
})
export class BoardComponent implements OnInit {
  public lists: object;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private taskServ: TasksService,
    private authSer: AuthService,
    private _toast : ToastService
  ) 

  {
    this.lists = {};
  }

  ngOnInit(): void {
    this.getTask();
  }
  getTask() {
    this.taskServ
      .getTaskByExecutor(this.authSer.getLoggedUser().id)
      .subscribe((tasks: any) => {
        this.lists = {
          PENDING: tasks.filter((task) => task.Status == TaskStatus.PENDING),
          OPEN: tasks.filter((task) => task.Status == TaskStatus.OPEN),
          CLOSED: tasks.filter((task) => task.Status == TaskStatus.CLOSED),
        };
      });
  }
  public unsorted(): void {
  }
  public drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer !== event.container) {
      const task = event.item.data;

      task.Status = TaskStatus[event.container.id];
      let data = {
        Status: TaskStatus[event.container.id],
      };
      this.taskServ.updateTaskStatus(task._id,task).subscribe({
        next: (res) => {
          this._toast.setSuccess(res.message);
          this.getTask();
        },
      });
    }
  }

  getColor(k){
      if(k=="PENDING"){
        return "col-red"
      }
      else if(k=="OPEN")
      { return "col-blue"}

      else if(k=="CLOSED")
      { return "col-green"}
    }
}
