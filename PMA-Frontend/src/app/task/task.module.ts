import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TaskComponent } from "./task.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgScrollbarModule } from "ngx-scrollbar";
import { TaskRoutingModule } from "./task-routing.module";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatCardModule } from "@angular/material/card";
import { MatSortModule } from "@angular/material/sort";
import { MatToolbarModule } from "@angular/material/toolbar";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ComponentsModule } from "../shared/components/components.module";
import { MatTableExporterModule } from "mat-table-exporter";
import { FormDialogComponent } from "./dialogs/form-dialog/form-dialog.component";
import { DeleteComponent } from "./dialogs/delete/delete.component";
import { MatDialogModule } from "@angular/material/dialog";
import { FeatherIconsModule } from "../shared/feather-icons.module";
import { FeatherComponent } from "angular-feather";
import { FeatherIconsComponent } from "../shared/components/feather-icons/feather-icons.component";
import { SharedModule } from "../shared/shared.module";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
@NgModule({
  imports: [
    CommonModule,
    FeatherIconsModule,
    FormsModule,
    NgScrollbarModule,
    TaskRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatDialogModule,
    OwlDateTimeModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatMenuModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    OwlNativeDateTimeModule,
    MatSortModule,
    MatToolbarModule,
    DragDropModule,
    ComponentsModule,
    SharedModule,
    MatTableExporterModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  declarations: [TaskComponent,FormDialogComponent,DeleteComponent],
})
export class TaskModule {}
