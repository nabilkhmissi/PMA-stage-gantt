import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AuthService } from "src/app/core/service/auth.service";
import { ProjectsService } from "src/app/core/service/projects.service";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";
import { ToastService } from "src/app/core/service/toast.service";

@Component({
  selector: "app-add-project",
  templateUrl: "./add-project.component.html",
  styleUrls: ["./add-project.component.sass"],
})
export class AddprojectsComponent implements OnInit {
  projectForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  clients: []
  teamlist: any[]
  TeamLeaders: any[]
  data
  retrieveddata: string = null;
  @ViewChild("myEditor", { static: false }) myEditor: any;
  public Editor = ClassicEditor;
  constructor(
    private fb: UntypedFormBuilder, 
    private authServ: AuthService,
    private projectServ: ProjectsService, 
    private _toast : ToastService
  ) {
    this.projectForm = this.fb.group({
      projectTitle: ["", [Validators.required]],
      type: ["", [Validators.required]],
      priority: ["", [Validators.required]],
      client: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      team: ["", [Validators.required]],
      TeamLeader: ["", [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.authServ.getallCient().subscribe({
      next: (res) => {
        this.clients = res;
      }
    })
    this.authServ.getAllEngineersAndTeamLeaders().subscribe({
      next: (res) => {
        this.teamlist = res;
      }
    })
    this.authServ.getallTeamLeader().subscribe({
      next: (res) => {
        this.TeamLeaders = res;
        this.TeamLeaders = this.TeamLeaders.concat(this.teamlist)
      }
    })
  }
  resetForm() {
    this.projectForm.reset();
    this.projectForm.reset();
    Object.keys(this.projectForm.controls).forEach(key => {
      this.projectForm.get(key).setErrors(null);
    });
  }
  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.retrieveddata = data.replace(/<\/?[^>]+(>|$)/g, "");;
  }
  onSubmit() {
    let formData = new FormData();
    formData.append("Projectname", this.projectForm.value.projectTitle)
    formData.append("description", this.retrieveddata)
    formData.append("TeamLeader", this.projectForm.value.TeamLeader)
    formData.append("type", this.projectForm.value.type)
    formData.append("equipe", JSON.stringify(this.projectForm.value.team))
    formData.append("client", this.projectForm.value.client)
    formData.append("dateFin", this.projectForm.value.endDate)
    formData.append("dateDebut", this.projectForm.value.startDate)
    formData.append("priority", this.projectForm.value.priority)
    formData.append("status", "Pending")

    this.projectServ.addProject(formData).subscribe({
      next: (res) => {
        this._toast.setSuccess(res.message);
        this.resetForm();
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    })
  }
}
