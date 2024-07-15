import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  dialogData: any;

  readonly baseUrl = environment.apiUrl;
  private reclamationAPI = `${this.baseUrl}/api/v1/reclamations`;

  constructor(private http: HttpClient) { }
  getDialogData() {
    return this.dialogData;
  }
  addReclamation(data: any) {
    this.dialogData = data
    return this.http.post<{ message : string }>(`${this.reclamationAPI}/AddReclamation`, data)
  }
  getAllReclamations() {
    var url = `${this.reclamationAPI}/getAllReclamations`;
    return this.http.get<[]>(url);
  }

  getAllReclamationsPending() {
    var url = `${this.reclamationAPI}/getAllReclamationsPending`;
    return this.http.get<[]>(url);
  }

  deleteReclamation(id) {
    return this.http.delete<{ message : string }>(`${this.reclamationAPI}/deleteReclamation/${id}`)
  }

  UpdateReclamationStatus(id, data) {
    return this.http.patch(`${this.reclamationAPI}/UpdateReclamationStatus/${id}`, data)
  }
  UpdateReclamation(id: any, data){
    this.dialogData = data

    return this.http.patch<{ message : string }>(`${this.reclamationAPI}/UpdateReclamation/${id}`, data)
  }
  getReclamationByProject(id: any) {
    return this.http.get(`${this.reclamationAPI}/getReclamationsByProject/${id}`)
  }
  getReclamtionByCleit(id: any) {
    return this.http.get<[]>(`${this.reclamationAPI}/getReclamationsByclient/${id}`)
  }
  getReclamtionsbyProduct(id: any) {
    return this.http.get<[]>(`${this.reclamationAPI}/getRclms/${id}`)
  }
}
