import { Injectable } from "@angular/core";
import { Adapter } from "./adapters";

export enum TaskStatus {
  PENDING = "Pending",
  OPEN = "Open",
  CLOSED = "Closed",
// COMPLETED = "Completed",
}

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Meduim",
  HIGH = "High",
}
export enum TaskType {
  ERROR = "Error",
  BUG = "BUG",
  DEVELOPMENT = "Development",
 // TESTING = "Testing",
}


