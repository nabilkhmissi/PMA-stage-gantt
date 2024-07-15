import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProcesverbalComponent } from "./procesverbal.component";

const routes: Routes = [
  {
    path: "",
    component: ProcesverbalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvanceTableRoutingModule {}
