import { Page404Component } from "../authentication/page404/page404.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AttendancesComponent } from "./attendance/attendance.component";
import { MyTeamsComponent } from "./myteam/myteam.component";
import { SettingsComponent } from "./settings/settings.component";
import { MyLeavesComponent } from "./my-leaves/my-leaves.component";
import { MyProjectsComponent } from "./my-projects/my-projects.component";
import { MyTasksComponent } from "./my-tasks/my-tasks.component";
import { RisksComponent } from "./risks/risks.component";
import { KanbanTaskComponent } from "./kanban-task/kanban-task.component";
import { ProjectDetailsComponent } from "./my-projects/project-details/project-details.component";
const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "attendance",
    component: AttendancesComponent,
  },
  {
path:"risk",
component:RisksComponent
  },
  {
    path: "myteam",
    component: MyTeamsComponent,
  },
  {
    path: "myprojects",
    component: MyProjectsComponent,
  },
  {
    path: "mytasks",
    component: MyTasksComponent,
  },
  {
    path: "KanbanTasks",
    component: KanbanTaskComponent,
  },
  {
    path: "myleaves",
    component: MyLeavesComponent,
  },
  {
    path: "settings",
    component: SettingsComponent,
  },
  {
    path: "projectDetails",
    children:[
      {path :":id" ,component:ProjectDetailsComponent }
    ]
    //component: ProjectDetailsComponent,
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
