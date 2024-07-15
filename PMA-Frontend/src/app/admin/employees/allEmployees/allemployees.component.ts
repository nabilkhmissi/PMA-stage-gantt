import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatMenuTrigger } from "@angular/material/menu";
import { FormDialogComponent } from "./dialogs/form-dialog/form-dialog.component";
import { DeleteDialogComponent } from "./dialogs/delete/delete.component";
import { SelectionModel } from "@angular/cdk/collections";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { AuthService } from "src/app/core/service/auth.service";
import { MatTableDataSource } from "@angular/material/table";
@Component({
  selector: "app-allemployees",
  templateUrl: "./allemployees.component.html",
  styleUrls: ["./allemployees.component.sass"],
})
export class AllemployeesComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    "img",
    "fullName",
    "department",
    "roles",
    "gender",
    "phone",
    "email",
    "actions",
  ];
  filter: string
  badgeClass: string
  dataSource: MatTableDataSource<any[]>;
  selection = new SelectionModel<any>(true, []);
  index: number;
  id: number;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  ngOnInit() {
    this.authService.getallEngineer().subscribe({
      next: (res) => {
        if (res) {
          this.dataSource = new MatTableDataSource(res)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort
        }
      }
    });
  }
  refresh() {
    this.authService.getallEngineer().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.filter = ""
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
        employees: row,
        action: "edit",
      },
      direction: tempDirection,
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
      }
    });
  }

  applyfilter(filter: any) {
    this.dataSource.filter = filter.target.value
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 1000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  turnToTeamLeader(row: any) {
    if (row.roles == "Engineer") {
      //console.log("enfff");
      let data = {
        roles: ["Team Leader"]
      }
      this.authService.updateuserRole(row._id, data).subscribe({
        next: (res) => {
          // this.badgeClass="badge badge-solid-blue"
          this.affecterClass(row)
          this.refresh()
          this.showNotification("snackbar-success",
            "User Roles Turned to Team Leader successfully",
            "bottom",
            "center")
          // console.log(row.roles);

        }
      })
    }
    else if (row.roles == "Team Leader") {
      let data = {
        roles: ["Engineer"]
      }
      this.authService.updateuserRole(row._id, data).subscribe({
        next: (res) => {
          // this.badgeClass="badge badge-solid-green"
          this.affecterClass(row);
          this.refresh()
          this.showNotification("snackbar-info",
            "User Roles Turned to Engineer successfully",
            "bottom",
            "center")
          //console.log(row.roles);


        }
      })
    }


  }
  // context menu
  /*   onContextMenu(event: MouseEvent, item: any) {
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + "px";
      this.contextMenuPosition.y = event.clientY + "px";
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem("mouse");
      this.contextMenu.openMenu();
    } */

  affecterClass(row: any) {
    if (row.roles == "Engineer")
      return this.badgeClass = "badge badge-solid-blue"
    else {
      return this.badgeClass = "badge badge-solid-green"
    }
  }

}
