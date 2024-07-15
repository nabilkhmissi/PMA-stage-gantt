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
  ApexFill,
  ApexGrid,
  ApexResponsive,
} from "ng-apexcharts";
import { ProjectsService } from "src/app/core/service/projects.service";
import { TasksService } from "src/app/core/service/tasks.service";
import { AuthService } from "src/app/core/service/auth.service";

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
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.sass"],
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public barChartOptions: Partial<chartOptions>;
  public radialChartOptions: Partial<chartOptions>;
  public gaugeChartOptions: Partial<chartOptions>;
  public stackBarChart: Partial<chartOptions>;
  loading:boolean=true
  mytasks
  myproject
  nb_newTask = 0
  nb_done = 0
  nb_closed = 0
  name = []
  prog = []
  constructor(private projectServ: ProjectsService, private taskServ: TasksService, private AuthServ: AuthService) { }

  toggle(task, nav: any) {
    task.done = !task.done;
  }
  ngOnInit() {
    this.chart2();
    this.fetchTasks()
    this.projectServ.getmyProject(this.AuthServ.getLoggedUser().id).subscribe({
      next: (res) => {
        this.myproject = res
        this.projectname(this.myproject);
        this.projectProgress(this.myproject)
      }
    })
  }
  cal(tab: any[]) {
    tab.forEach((item: any) => {
      if (item.Status == "Open") {
        this.nb_done++
      }
      else if (item.Status == "Closed") {
        this.nb_closed++
      }
      else if (item.Status == "Pending") {
        this.nb_newTask++;
      }
    })
  }
  private chart2() {
    this.radialChartOptions = {
      radialseries: this.prog,
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
              formatter: function (w) {
                let sum = (w.globals.seriesTotals.reduce((a, b) => a + b, 0) / w.globals.series.length).toFixed() + "%";
                return sum.toString()
              }
            },
          },
        },
      },
      labels: this.name,
    };
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
        this.mytasks = res
      }
    })
  }
  fetchTasks() {
    this.taskServ.getTaskByExecutor(this.AuthServ.getLoggedUser().id).subscribe({
      next: (res) => {
        this.loading = false
        this.mytasks = res
        this.cal(this.mytasks)
      }
    })
  }
  public getColor(index: number): string {
    switch (index) {
      case 0: return " bg-blue"
      case 1: return " bg-green"
      case 2: return "bg-orange"
      //case 3 : return "bg-orange"
      //case 4: return "bg-green"
      case 3: return "bg-red"
      default: return "bg-green"
    }
  }
  private projectname(tab: any[]) {
    tab.forEach((item: any) => {
      this.name.push(item.Projectname)
    })
  }
  private projectProgress(tab: any[]) {
    tab.forEach((item: any) => {
      this.prog.push(Math.round(+item.progress))
    })
  }
}
