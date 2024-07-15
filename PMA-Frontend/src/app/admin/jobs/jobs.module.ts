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
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatSortModule } from "@angular/material/sort";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { SharedModule } from "src/app/shared/shared.module";

import { JobsRoutingModule } from "./jobs-routing.module";
import { JobsListComponent } from "./jobs-list/jobs-list.component";
import { DeleteDialogComponent } from "./jobs-list/dialogs/delete/delete.component";
import { FormDialogComponent } from "./jobs-list/dialogs/form-dialog/form-dialog.component";
import { JobsListService } from "./jobs-list/jobs-list.service";
import { ResumesComponent } from "./resumes/resumes.component";
import { DeleteDialogComponent as ResumeDeleteComponent } from "./resumes/dialogs/delete/delete.component";
import { FormDialogComponent as ResumeFormDialogComponent } from "./resumes/dialogs/form-dialog/form-dialog.component";
import { ResumesService } from "./resumes/resumes.service";
import { CandidatesComponent } from "./candidates/candidates.component";
import { DeleteDialogComponent as CandidatesDeleteComponent } from "./candidates/dialogs/delete/delete.component";
import { FormDialogComponent as CandidatesFormDialogComponent } from "./candidates/dialogs/form-dialog/form-dialog.component";
import { CandidatesService } from "./candidates/candidates.service";
import { ShortlistComponent } from "./shortlist/shortlist.component";
import { DeleteDialogComponent as ShortlistDeleteComponent } from "./shortlist/dialogs/delete/delete.component";
import { FormDialogComponent as ShortlistFormDialogComponent } from "./shortlist/dialogs/form-dialog/form-dialog.component";
import { ShortlistService } from "./shortlist/shortlist.service";

@NgModule({
  declarations: [
    JobsListComponent,
    DeleteDialogComponent,
    FormDialogComponent,
    ResumesComponent,
    ResumeDeleteComponent,
    ResumeFormDialogComponent,
    CandidatesComponent,
    CandidatesDeleteComponent,
    CandidatesFormDialogComponent,
    ShortlistComponent,
    ShortlistDeleteComponent,
    ShortlistFormDialogComponent,
  ],
  imports: [
    CommonModule,
    JobsRoutingModule,
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
    MatMenuModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTableExporterModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ComponentsModule,
    SharedModule,
  ],
  providers: [
    JobsListService,
    ResumesService,
    CandidatesService,
    ShortlistService,
  ],
})
export class JobsModule {}
