import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ClaimsComponent } from "../client/supports/claims/claims.component";
import { MyTasks } from "../employee/my-tasks/my-tasks.model";
import { ClientReclamationComponent } from "./client-reclamation/client-reclamation.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MyTasksComponent } from "./my-tasks/my-tasks.component";
import { ProcesVerbalComponent } from "./proces-verbal/proces-verbal.component";
import { AllProjectsComponent } from "./projects/all-projects/all-projects.component";
import { ProjectsComponent } from "./projects/projects.component";
import { RisksComponent } from "./risks/risks.component";
import { TasksComponent } from "./tasks/tasks.component";

const routes: Routes = [
  {
    path: "dashboard",
component:DashboardComponent
  },
  {
    path:"tasks",
    component:TasksComponent
  },
  {
    path:"client-claims",
    component:ClientReclamationComponent
  },
  {
    path:"Mytasks",
    component:MyTasksComponent
  },
  {
    path:"proces-verbal",
    component:ProcesVerbalComponent
  },
  {
    path:"all-projects",
    component:AllProjectsComponent
  },
  {
    path: "projectDetails",
    children:[
      {path :":id" ,component: ProjectsComponent}
    ]
    //component: ProjectDetailsComponent,
  },

  {
path:"risk",
component:RisksComponent
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductOwnerRoutingModule {}
