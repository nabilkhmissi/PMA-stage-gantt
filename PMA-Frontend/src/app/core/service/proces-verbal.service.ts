import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcesVerbalService {


  dialogData: any;
  readonly baseUrl = environment.apiUrl;
  private ProcesAPI = `${this.baseUrl}/api/v1/procesV`;

  constructor(private http: HttpClient) { }

  getDialogDate() {
    return this.dialogData
  }

  addProceVerbal(data: any){
    this.dialogData = data
    return this.http.post<{ message : string }>(`${this.ProcesAPI}/addProcesV`, data)
  }
  getAllProcesVerbal(): Observable<[]> {
    return this.http.get<[]>(`${this.ProcesAPI}/getAllProcesV`)

  }

  updateProcesv(id: any, data){
    this.dialogData = data
    return this.http.put<{ message : string }>(`${this.ProcesAPI}/updateProcesv/${id}`, data)
  }

  deleteProcesV(id: any) {
    return this.http.delete<{ message : string }>(`${this.ProcesAPI}/deleteProcesV/${id}`)
  }

  getProcesByUser(id: any): Observable<[]> {
    return this.http.get<[]>(`${this.ProcesAPI}/getProcesByUser/${id}`)
  }

  getProcesByProject(id: any): Observable<[]> {
    return this.http.get<[]>(`${this.ProcesAPI}/getProcesByProject/${id}`)
  }


}
