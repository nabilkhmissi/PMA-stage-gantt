import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { MyProjectsService } from "../my-projects.service";
import { MyProjects } from "../my-projects.model";
import { saveAs } from 'file-saver';
import { ProjectsService } from "src/app/core/service/projects.service";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.sass"],
})
export class FormComponent {
  action: string;
  dialogTitle: string;
  isDetails = false;
  myProjects: MyProjects;
  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public myProjectsService: ProjectsService
  ) {
    // Set the defaults
    this.myProjects = data.myProjects;
    this.isDetails = true;
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  download(file) {
		this.myProjectsService.downloadfile(file).subscribe((response: any) => {
			let blob:any = new Blob([response], { type: 'file' });
			const url = window.URL.createObjectURL(blob);
			//window.open(url);
			saveAs(blob, file);
			}), (error: any) => console.log('Error downloading the file'),
			() => console.info('File downloaded successfully');
	}
}
