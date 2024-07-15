import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Page404Component } from "src/app/authentication/page404/page404.component";
import { TicketDetailsComponent } from "./ticket-details/ticket-details.component";
import { ClaimsComponent } from "./claims/claims.component";

const routes: Routes = [
  {
    path: "claims",
    component: ClaimsComponent,
  },
  {
    path: "ticketDetails",
    component: TicketDetailsComponent,
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportsRoutingModule {}
