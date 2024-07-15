import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSortModule } from "@angular/material/sort";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatMenuModule } from "@angular/material/menu";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableExporterModule } from "mat-table-exporter";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { SharedModule } from "src/app/shared/shared.module";

import { ReportsRoutingModule } from "./reports-routing.module";
import { ReclamationsComponent } from "./reclamations/reclamations.component";
import { LeaveReportService } from "./reclamations/leave-report.service";
import { RisksComponent } from "./expense/risks.component";
import { FormDialogComponent } from "./dialogs/form-dialog/form-dialog.component";
import { DeleteComponent } from "./dialogs/delete/delete.component";
import { FeatherIconsModule } from "src/app/shared/feather-icons.module";
import { DeleteRComponent } from './expense/dialog/delete-r/delete-r.component';
import { FormRComponent } from './expense/dialog/form-r/form-r.component';

@NgModule({
  declarations: [ReclamationsComponent, RisksComponent,FormDialogComponent,DeleteComponent, DeleteRComponent, FormRComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatRadioModule,
    MatSelectModule,
    FeatherIconsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    DragDropModule,
    MatChipsModule,
    MatTableExporterModule,
    MatProgressBarModule,
    MatTabsModule,
    CKEditorModule,
    ComponentsModule,
    SharedModule,
  ],
  providers: [LeaveReportService,],
})
export class ReportsModule {}
