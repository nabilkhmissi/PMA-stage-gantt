import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  dialogData: any

  readonly baseUrl = environment.apiUrl;
  private taskApi = `${this.baseUrl}/api/v1/tasks`;

  getDialogData() {
    return this.dialogData;
  }
  constructor(private http: HttpClient) { }

  addTask(data: any) {
    this.dialogData = data
    return this.http.post<{ message : string }>(`${this.taskApi}/createTask`, data)
  }
  getAll() {
    var url = `${this.taskApi}/getAllTasks`;
    return this.http.get<[]>(url)
  }

  updatetask(id, data: any) {
    this.dialogData = data
    return this.http.put<{ message : string }>(`${this.taskApi}/updateTask/${id}`, data)
  }
  updateTaskStatus(id, data: any) {
    return this.http.patch<{ message : string }>(`${this.taskApi}/updateTaskStatus/${id}`, data)
  }
  deleteTask(id) {
    return this.http.delete<{ message : string }>(`${this.taskApi}/deleteTaks/${id}`)
  }

  getTaskbyproject(id: any) {
    return this.http.get<[]>(`${this.taskApi}/getTaskByProject/${id}`)
  }

  getTaskbyprojectWithSort(id: any, statusSort: string, dateSort: number) {
    return this.http.get<[]>(`${this.taskApi}/getTaskByProject/${id}?status=${statusSort}&date=${dateSort}`)
  }

  getTaskByExecutor(id: any) {
    return this.http.get<[]>(`${this.taskApi}/getTaskByExecutor/${id}`)
  }

  getTasksByTeamLeader(id: any) {
    return this.http.get<[]>(`${this.taskApi}/gettskks/${id}`)
  }
}



