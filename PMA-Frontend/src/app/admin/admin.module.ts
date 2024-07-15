import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { SharedModule } from "../shared/shared.module";
import { TaskModule } from "../task/task.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, AdminRoutingModule, SharedModule, TaskModule],
})
export class AdminModule {}
