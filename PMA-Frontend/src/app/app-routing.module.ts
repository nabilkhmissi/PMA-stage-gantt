import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "./authentication/page404/page404.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { Role } from "./core/models/role";
import { AuthLayoutComponent } from "./layout/app-layout/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./layout/app-layout/main-layout/main-layout.component";
import { AdminGuard } from "./core/guard/admin.guard";
const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
   // canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "/authentication/signin", pathMatch: "full" },
      {
        path: "admin",
       canActivate: [AuthGuard, AdminGuard],
        data: {
          role: Role.Admin,
        },
        loadChildren: () =>
          import("./admin/admin.module").then((m) => m.AdminModule),
      },
      {
        path: "employee",
        canActivate: [AuthGuard],
        data: {
          role: [Role.Engineer],
        },
        loadChildren: () =>
          import("./employee/employee.module").then((m) => m.EmployeeModule),
      },
      {
        path: "TeamLeader",
        canActivate: [AuthGuard],
        data: {
          role: [Role.TeamLeader],
        },
        loadChildren: () =>
          import("./ProductOwner/ProductOwner.module").then((m) => m.ProductOwnerModule),
      },
      {
        path: "client",
        canActivate: [AuthGuard],
        data: {
          role: Role.Client,
        },
        loadChildren: () =>
          import("./client/client.module").then((m) => m.ClientModule),
      },
      {
        path: "calendar",
        loadChildren: () =>
          import("./calendar/calendar.module").then((m) => m.CalendarsModule),
      },
      {
        path: "task",
        data:{
          role:Role.Admin
        },
        canActivate: [AuthGuard],

        loadChildren: () =>
          import("./task/task.module").then((m) => m.TaskModule),
      },
      {
        path: "Proces",
        loadChildren: () =>
          import("./procesverbal/contacts.module").then((m) => m.ContactsModule),
      },
      {
        path: "email",
        loadChildren: () =>
          import("./email/email.module").then((m) => m.EmailModule),
      },
      {
        path: "calendar",
        loadChildren: () =>
          import("./apps/apps.module").then((m) => m.AppsModule),
      },
      {
        path: "apps",
        loadChildren: () =>
          import("./apps/apps.module").then((m) => m.AppsModule),
      },

      {
        path: "charts",
        loadChildren: () =>
          import("./charts/charts.module").then((m) => m.ChartsModule),
      },
      {
        path: "timeline",
        loadChildren: () =>
          import("./timeline/timeline.module").then((m) => m.TimelineModule),
      },

      {
        path: "extra-pages",
        loadChildren: () =>
          import("./extra-pages/extra-pages.module").then(
            (m) => m.ExtraPagesModule
          ),
      },


    ],
  },
  {
    path: "authentication",
    component: AuthLayoutComponent,
    loadChildren: () =>
      import("./authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: "**", component: Page404Component },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
