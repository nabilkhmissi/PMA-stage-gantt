import { Injectable } from "@angular/core";
import { Adapter } from "./adapters";

export enum ProjectStatus {
  NEWPROJECT = "Pending",
  INPROGRESS = "In Progress",
  ONHOLD = "On Hold",
  COMPLETED = "Completed",
}

export enum ProjectPriority {
  LOW = "Low",
  MEDIUM = "Meduim",
  HIGH = "High",
}
export enum ProjectType {
  SYS = "Systems Infrastructure",
  NET = "Network Infrastructure",
  SYSNET = "Systems and Network Infrastructure",
  DEV = "Development",

  /* Systems Infrastructure , Network Infrastructure , Systems and Network Infrastructure, Development */
}

export class Project {
  constructor(
    public id: number,
    public name: string,
    public status: string = ProjectStatus.NEWPROJECT,
    public description: string = null,
    public deadline: Date = null,
    public priority: string = ProjectPriority.MEDIUM,
    public open_task: number = null,
    public type: string = ProjectType.SYS,
    public created: Date = null,
    public team_leader: string = null,
    public comments: number = null,
    public bugs: number = null,
    public progress: number = null
  ) {}
}

@Injectable({
  providedIn: "root",
})
export class ProjectAdapter implements Adapter<Project> {
  adapt(item: any): Project {
    const adapted = new Project(
      Number(item.id),
      item.name,
      item.status,
      item.description,
      item.deadline ? new Date(item.deadline) : undefined,
      item.priority ,
      item.open_task,
      item.type,
      item.created ? new Date(item.created) : undefined,
      item.team_leader,
      item.comments ? Number(item.comments) : undefined,
      item.bugs ? Number(item.bugs) : undefined,
      item.progress ? Number(item.progress) : undefined
    );
    return adapted;
  }
}
