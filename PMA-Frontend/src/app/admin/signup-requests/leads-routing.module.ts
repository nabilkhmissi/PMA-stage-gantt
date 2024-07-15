import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SignupRequestsComponent } from "./signup-requests.component";

const routes: Routes = [
  {
    path: "",
    component: SignupRequestsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadsRoutingModule {}
