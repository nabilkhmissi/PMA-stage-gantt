import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks/tasks.component';
import { ProcesVerbalComponent } from './proces-verbal/proces-verbal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../shared/components/components.module';
import { ProductOwnerRoutingModule } from './productowner-routing.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatTableExporterModule } from 'mat-table-exporter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartsModule as chartjsModule } from 'ng2-charts';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteComponent } from './risks/dialogs/delete/delete.component';
import { ProjectsComponent } from './projects/projects.component';
import { DeleteComponent as MyTaskDelete } from './tasks/dialogs/delete/delete/delete.component';
import { DeleteComponent as MyProces } from './proces-verbal/delete/delete.component';
import { FormDialogComponent } from './tasks/dialogs/form-dialog/form-dialog/form-dialog.component';
import { AllProjectsComponent } from './projects/all-projects/all-projects.component';
import { BoardComponent } from './projects/board/board.component';
import { ProjectDialogComponent } from './projects/project-dialog/project-dialog.component';
import { PluralPipe, TruncatePipe } from './projects/core/pipes';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { FormComponent } from './proces-verbal/form/form.component';
import { RisksComponent } from './risks/risks.component';
import { FormsComponent } from './risks/dialogs/forms/forms.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { DeleteMyComponent } from './my-tasks/Dialogs/delete-my/delete-my.component';
import { FormMyComponent } from './my-tasks/Dialogs/form-my/form-my.component';
import { ClientReclamationComponent } from './client-reclamation/client-reclamation.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TaskModule } from '../task/task.module';
@NgModule({
  declarations: [
    DeleteComponent,
    MyProces,
    TasksComponent,
    ProcesVerbalComponent,
    DashboardComponent,
    ProjectsComponent,
    MyTaskDelete,
    FormDialogComponent,
    AllProjectsComponent,
    BoardComponent,
    ProjectDialogComponent,
    TruncatePipe,
    PluralPipe,
    FormComponent,
    RisksComponent,
    FormsComponent,
    MyTasksComponent,
    DeleteMyComponent,
    FormMyComponent,
    ClientReclamationComponent,
  ],
  imports: [
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NgScrollbarModule,
    DragDropModule,
    chartjsModule,
    NgApexchartsModule,
    ComponentsModule,
    SharedModule,
    ProductOwnerRoutingModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatChipsModule,
    MatTableExporterModule,
    MatProgressBarModule,
    MatTabsModule,
    MatIconModule,
    OwlNativeDateTimeModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatDialogModule,
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
    MatSortModule,
    MatToolbarModule,
    DragDropModule,
    MatTableExporterModule,
    OwlDateTimeModule,
    TaskModule
  ],
})
export class ProductOwnerModule {}
