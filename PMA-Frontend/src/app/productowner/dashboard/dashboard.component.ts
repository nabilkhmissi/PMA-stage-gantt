import { Component,OnInit, ViewChild  } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
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
  ApexFill,
  ApexGrid,
  ApexResponsive,
} from "ng-apexcharts";
import { AuthService } from 'src/app/core/service/auth.service';
import { TasksService } from 'src/app/core/service/tasks.service';
import { ProjectsService } from 'src/app/core/service/projects.service';

export type chartOptions = {
  series: ApexAxisChartSeries;
  radialseries: ApexNonAxisChartSeries;
  series2: ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  stroke: ApexStroke;
  legend: ApexLegend;
  colors: string[];
  responsive: ApexResponsive[];
  labels: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  prog=[]
  tasks:any[]=[]
  loading:boolean=true
  user
  nb_pending=0
  nb_closed=0
  nb_open=0
  name=[]
  myProjects:any[]=[]
  @ViewChild("chart") chart: ChartComponent;
  public barChartOptions: Partial<chartOptions>;
  public radialChartOptions: Partial<chartOptions>;
  public gaugeChartOptions: Partial<chartOptions>;
  public stackBarChart: Partial<chartOptions>;
  constructor(private authServ:AuthService,private taskServ:TasksService,private projectServ:ProjectsService) {}



  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }

  toggle(task, nav: any) {
    task.done = !task.done;
  }
  ngOnInit() {
    this.fetchTasks()
    this.user=this.authServ.getLoggedUser()
    this.projectServ.getProjectsByTeamleader(this.user.id).subscribe({
      next:(res)=>{
        this.myProjects=res
        this.projectname(this.myProjects)
        this.projectProgress(this.myProjects)
        this.chart2();
      }
    })
  }
  progress(item) {
  return "width-per-"+item.progress
  }
  cal(tab:any[]){
    tab.forEach((item:any)=>{
      if(item.Status=="Open"){
        this.nb_open=this.nb_open+1
      }
      else if(item.Status=="Closed"){
       this.nb_closed++
      }
      else if(item.Status=="Pending"){
        this.nb_pending++;
      }
    })
  }
  private chart2() {
      this.radialChartOptions = {
        radialseries:this.prog,
        chart: {
          height: 290,
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: "22px",
              },
              value: {
                fontSize: "16px",
              },
              total: {
                show: true,
                label: "Average",
                formatter:function(w){
                  let sum= (w.globals.seriesTotals.reduce((a, b) => a + b, 0) /w.globals.series.length).toFixed()+"%";
                    return sum.toString()
                }
              },
            },
          },
        },
        labels:this.name,
      };
  }
  public getColor(index :number) : string {
    switch( index) {
      case 0 : return " bg-blue"
      case 1 : return " bg-green"
      case 2 : return "bg-orange"
      case 3: return "bg-red"
      default: return "bg-green"
    }
  }
  private projectname(tab:any[]){
    tab.forEach((item:any)=>{
     this.name.push(item.Projectname)
    })
  }
private projectProgress(tab:any[]){
  tab.forEach((item:any)=>{
    this.prog.push(Math.round(+item.progress))
   })
}

  handleProjectSelect(e: any) {
    this.loading = true
    const project_id = e.target.value;
    if (project_id) {
      this.fetchTasksByProjectId(project_id);
    } else {
      this.fetchTasks();
    }
  }
  fetchTasksByProjectId(id: string) {
    this.taskServ.getTaskbyproject(id).subscribe({
      next: (res) => {
        this.loading = false
        this.tasks = res
      }
    })
  }
  fetchTasks() {
    this.taskServ.getTasksByTeamLeader(this.authServ.getLoggedUser().id).subscribe({
      next: (res) => {
        this.loading = false
        this.tasks = res
        this.cal(this.tasks)
      }
    })
  }
}
