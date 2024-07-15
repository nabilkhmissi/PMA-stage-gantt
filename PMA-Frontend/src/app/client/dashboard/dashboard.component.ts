import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexMarkers,
  ApexGrid,
  ApexTitleSubtitle,
} from "ng-apexcharts";
import { AuthService } from "src/app/core/service/auth.service";
import { ProjectsService } from "src/app/core/service/projects.service";
import { ReclamationService } from "src/app/core/service/reclamation.service";
export type areaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
};

export type restRateChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};
export type performanceRateChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

export type radialChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  plotOptions: ApexPlotOptions;
};
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.sass"],
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public areaChartOptions: Partial<areaChartOptions>;
  public radialChartOptions: Partial<radialChartOptions>;
  public restRateChartOptions: Partial<restRateChartOptions>;
  public performanceRateChartOptions: Partial<performanceRateChartOptions>;
  user
  projects
  nb_onhold=0
  nb_Completed=0
  nb_progrees=0
  reclamations
  constructor(private authSer:AuthService,private projectServ:ProjectsService,private reclaserv:ReclamationService) {}
  ngOnInit() {
    this.user=this.authSer.getLoggedUser()
    this.projectServ.getprojectbyClient(this.user.id).subscribe({
      next:(res)=>{
        this.projects=res
        this.cal(this.projects)
      }
    })
    this.reclaserv.getReclamtionByCleit(this.user.id).subscribe({
      next:(res)=>{
        this.reclamations=res;
      }
    })

  }
  cal(tab:any[]){
    tab.forEach((item:any)=>{
      if(item.status=="On Hold"){
        this.nb_onhold=this.nb_onhold+1
      }
      else if(item.status=="Completed"){
       this.nb_Completed++
      }
      else if(item.status=="In Progress"){
        this.nb_progrees++;
      }
    })
  }
  public getColor(index :number) : string {
    switch( index) {
      case 0 : return "col-red"
      case 1 : return "col-amber"
      case 2 : return "col-purple"
      case 3 : return "col-blue"
      case 4: return "col-cryan"
      case 5: return "col-green"
      default: return "col-green"
    }
  }
}
