import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ProjectsService {

  serverImageUrl = `${environment.apiUrl}/static/images`;
  serverProjectsUrl = `${environment.apiUrl}/projectsFile`;

  readonly baseUrl = environment.apiUrl;
  private ProjectApi = `${this.baseUrl}/api/v1/projects`;
  private localFileApi = `${this.baseUrl}/api/v1/projects`;

  dialogData: any;

  constructor(private authserv: AuthService, private http: HttpClient) {
  }
  getDialogData() {
    return this.dialogData;
  }
  addProject(data: any) {
    return this.http.post<{ message : string }>(`${this.ProjectApi}/addProject`, data);
  }

  getAllProjects(year?: number) {
    var url = `${this.ProjectApi}/getAllProjects`;
    if (year) {
      url = `${url}?year=${year}`
    }
    return this.http.get(url).pipe(
      map((res: any) => res.map(project => {
        return {
          ...project,
          equipe: project.equipe.map(user => ({ ...user, image: `${this.serverImageUrl}/${user.image}` }))
        }
      }))
    )
  }
  sendfile(data:any){
    return this.http.post(`${this.ProjectApi}/shareFile`,data).pipe(
      catchError(throwError)
    );
  }
  getAllProjectsDone() {
    return this.http.get<[]>(`${this.ProjectApi}/getAllProjectsDone`)
  }

  getAllProjectsPending() {
    return this.http.get<[]>(`${this.ProjectApi}/getAllProjectsPending`)
  }
  getAllProjectsProgress() {
    return this.http.get<[]>(`${this.ProjectApi}/getAllProjectsProgress`)
  }
  getAllProjectsTest() {
    return this.http.get<[]>(`${this.ProjectApi}/getAllProjectsTest`)
  }
  getProjectLate() {
    return this.http.get<[]>(`${this.ProjectApi}/getProjectLate`)
  }
  updateStatus(id: any, data) {
    return this.http.patch<{ message : string }>(`${this.ProjectApi}/updateStatus/${id}`, data)
  }
  updateStatusToCompleted(id: any) {
    return this.http.patch<{ message : string }>(`${this.ProjectApi}/updateStatus/${id}`, {})
  }
  updateProject(id: any, data) {
    this.dialogData = data
    return this.http.patch<{ message : string }>(`${this.ProjectApi}/updateProject/${id}`, data)
  }
  addTeamMember(id: any, data) {
    return this.http.patch(`${this.ProjectApi}/addTeamMember/${id}`, data)
  }
  deleteMember(id: any) {
    return this.http.delete(`${this.ProjectApi}/deleteMember/${id}`)
  }
  deleteProject(id: any) {
    return this.http.delete<{ message : string }>(`${this.ProjectApi}/deleteProject/${id}`)
  }
  getProject(id: any) {
    return this.http.get(`${this.ProjectApi}/getproject/${id}`).pipe(
      map((project: any) => ({
        ...project,
        equipe: project.equipe.map(user => ({
          ...user,
          image: `${this.serverImageUrl}/${user.image}`
        }))
      }))
    )

  }
  getprojectbyClient(id: any) {
    return this.http.get<[]>(`${this.ProjectApi}/getprojectbyClient/${id}`)
  }
  createProject(data: any) {
    this.dialogData = data
    return this.http.post<{ message : string }>(`${this.ProjectApi}/createProject`, data)
  }
  downloadfile(file: any) {
    return this.http.get(`${this.serverProjectsUrl}/${file}`, { responseType: 'blob' })
  }

  getmyProject(id: any) {
    return this.http.get<[]>(`${this.ProjectApi}/getmyProjects/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.getLoggedUser()}`
      },
    }).pipe(
      map((projects: any) => projects.map(project => {
        return {
          ...project,
          equipe: project.equipe.map(user => ({ ...user, image: `${this.serverImageUrl}/${user.image}` }))
        }
      }))
    )
  }

  getProjectsByTeamleader(id: any) {
    return this.http.get<[]>(`${this.ProjectApi}/getProjectsByTeamleader/${id}`)
  }
  getDoneP(id: any) {
    return this.http.get(`${this.ProjectApi}/getDoneP/${id}`)
  }
  notequipe(id: any, data) {
    return this.http.patch(`${this.ProjectApi}/notequipe/${id}`, data)
  }
  noteCleint(id, data) {
    return this.http.patch<{ message : string }>(`${this.ProjectApi}/noteCleint/${id}`, data)
  }
  noteAdmin(id, data) {
    return this.http.patch(`${this.ProjectApi}/noteAdmin/${id}`, data)
  }
  addletter(id, data) {
    return this.http.patch<{ message : string }>(`${this.ProjectApi}/addletter/${id}`, data)
  }
  updateProg(id, data) {
    return this.http.patch<{ message : string }>(`${this.ProjectApi}/progress/${id}`, data)
  }

  addkik(id, data) {
    return this.http.patch<{ message : string }>(`${this.localFileApi}/addkik/${id}`, data)
  }
  addHLDLLD(id, data) {
    return this.http.patch<{ message : string }>(`${this.localFileApi}/addHLDLLD/${id}`, data)
  }
  addbuild(id, data) {
    return this.http.patch<{ message : string }>(`${this.localFileApi}/addbuild/${id}`, data)
  }
  addaccesd(id, data) {
    return this.http.patch<{ message : string }>(`${this.localFileApi}/addaccesd/${id}`, data)
  }
  addOther(id, data) {
    return this.http.patch<{ message : string }>(`${this.localFileApi}/addOther/${id}`, data)
  }
  addOther1(id, data) {
    return this.http.patch<{ message : string }>(`${this.localFileApi}/addOther1/${id}`, data)
  }
  addOther2(id, data) {
    return this.http.patch<{ message : string }>(`${this.localFileApi}/addOther2/${id}`, data)
  }
  addOther3(id, data) {
    return this.http.patch<{ message : string }>(`${this.localFileApi}/addOther3/${id}`, data)
  }
  getEngineersParticipations() {
    return this.http.get(`${this.ProjectApi}/getEngineersParticipations`)
  }
  getTeamLeadersParticipations() {
    return this.http.get(`${this.ProjectApi}/geTeamLeadersParticipations`)
  }
}
