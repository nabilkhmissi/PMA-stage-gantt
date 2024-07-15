import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { MyProjectsService } from "../../my-projects.service";
import { ProjectsService } from "src/app/core/service/projects.service";

@Component({
  selector: "app-delete",
  templateUrl: "./delete.component.html",
  styleUrls: ["./delete.component.sass"],
})
export class DeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
private projectServ :ProjectsService  ) {
  console.log(this.data);

}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.projectServ.deleteProject(this.data._id).subscribe({
      next :(res)=>{
        //console.log(res);

      },
      error:(err)=>{
        console.log(err);

      }
    })
  }
}
