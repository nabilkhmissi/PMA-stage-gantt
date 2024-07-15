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

import { PayrollRoutingModule } from "./payroll-routing.module";
import { EmployeeSalaryComponent } from "./employee-salary/employee-salary.component";
import { PayslipComponent } from "./payslip/payslip.component";
import { DeleteDialogComponent } from "./employee-salary/dialogs/delete/delete.component";
import { FormDialogComponent } from "./employee-salary/dialogs/form-dialog/form-dialog.component";
import { EmployeeSalaryService } from "./employee-salary/employee-salary.service";

@NgModule({
  declarations: [
    EmployeeSalaryComponent,
    PayslipComponent,
    DeleteDialogComponent,
    FormDialogComponent,
  ],
  imports: [
    CommonModule,
    PayrollRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSortModule,
    MatTableExporterModule,
    MatTooltipModule,
    MatToolbarModule,
    MatMenuModule,
    ComponentsModule,
    SharedModule,
    MatProgressSpinnerModule,
  ],
  providers: [EmployeeSalaryService],
})
export class PayrollModule {}
