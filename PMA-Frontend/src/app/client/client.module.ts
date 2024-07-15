import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgScrollbarModule } from "ngx-scrollbar";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { NgxEchartsModule } from "ngx-echarts";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTabsModule } from "@angular/material/tabs";
import { NgApexchartsModule } from "ng-apexcharts";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatRadioModule } from "@angular/material/radio";
import { MatTableExporterModule } from "mat-table-exporter";
import { ClientRoutingModule } from "./client-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { BillingComponent } from "./billing/billing.component";
import { SettingsComponent } from "./settings/settings.component";
import { MyProjectsService } from "./projects/my-projects/my-projects.service";
import { ComponentsModule } from "../shared/components/components.module";
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProcesVerbalComponent } from './proces-verbal/proces-verbal.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [DashboardComponent, BillingComponent, SettingsComponent, ProcesVerbalComponent],
  imports: [
    CommonModule,
    chartjsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    NgScrollbarModule,
    MatIconModule,
    MatButtonModule,
    ClientRoutingModule,
    NgApexchartsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatTabsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatTableExporterModule,
    MatTooltipModule,
    MatRadioModule,
    MatPaginatorModule,
    ComponentsModule,
    MatTableModule,
    MatDialogModule,
    SharedModule
  ],
  providers: [MyProjectsService],
})
export class ClientModule {}
