import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RisksService {
  dialogData: any;

  readonly baseUrl = environment.apiUrl;
  private RisksAPI = `${this.baseUrl}/api/v1/problems`;

  constructor(private http: HttpClient) { }
  getDialogData() {
    return this.dialogData;
  }

  addRisk(data: any) {
    this.dialogData = data;
    return this.http.post<{ message : string }>(`${this.RisksAPI}/createProb`, data);
  }
  getAllProblemes(){
    return this.http.get<[]>(`${this.RisksAPI}/getAllProblemes`);
  }
  getProbyUSer(id: any){
    return this.http.get<[]>(`${this.RisksAPI}/getProbyUSer/${id}`);
  }
  getProblemsByEquipeMember(id: any){
    return this.http.get<[]>(`${this.RisksAPI}/getProblemsByEquipeMember/${id}`);
  }
  getProbyProj(id: any){
    return this.http.get<[]>(`${this.RisksAPI}/getProbyProj/${id}`);
  }

  updateProbleme(id: any, data: any) {
    this.dialogData = data
    return this.http.patch<{ message : string }>(`${this.RisksAPI}/updateProbleme/${id}`, data)
  }

  deleteProbleme(id: any) {
    return this.http.delete<{ message : string }>(`${this.RisksAPI}/deleteProbleme/${id}`)
  }

}








