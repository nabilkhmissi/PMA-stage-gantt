import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReclamationsComponent } from "./reclamations/reclamations.component";
import { RisksComponent } from "./expense/risks.component";

const routes: Routes = [
  {
    path: "reclamations",
    component: ReclamationsComponent,
  },
  {
    path: "risks",
    component: RisksComponent,
  },
  {
    path: "expense-report",
    component: RisksComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
