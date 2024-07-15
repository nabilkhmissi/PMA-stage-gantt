import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  readonly baseUrl = environment.apiUrl;
  private EventApi = `${this.baseUrl}/api/v1/Events`;
  dialogData
  constructor(private authserv: AuthService,
    private http: HttpClient) {
  }
  getDialogData() {
    return this.dialogData;
  }
  addEvent(data: any) {
    this.dialogData = data
    return this.http.post<{ message : string }>(`${this.EventApi}/createEvent`, data)
  }

  deleteEvent(id) {
    return this.http.delete<{ message : string }>(`${this.EventApi}/deleteEvent/${id}`)
  }


  updatEvent(id, data: any) {
    this.dialogData = data
    return this.http.patch<{ message : string }>(`${this.EventApi}/updateEvent/${id}`, data)
  }

  updateEventCategroy(id, data: any) {

    return this.http.patch<{ message : string }>(`${this.EventApi}/updateEventCategory/${id}`, data)
  }

  getAllEvent(){
    return this.http.get<[]>(`${this.EventApi}/getAllEvent`)
  }

  getEventbyId(id) {
    return this.http.get<{}>(`${this.EventApi}/getEventById/${id}`)
  }
  getWorkEvent(){
    return this.http.get<[]>(`${this.EventApi}/getAllWorkEvent`)
  }
  getPersonalEvent(){
    return this.http.get<[]>(`${this.EventApi}/getAllPersonalEvent`)
  }
  getAllTravelEvent(){
    return this.http.get<[]>(`${this.EventApi}/getAllTravelEvent`)
  }
  getAllImportantEvent(){
    return this.http.get<[]>(`${this.EventApi}/getAllImportantEvent`)
  }
  getEventByuser(user){
    return this.http.get<[]>(`${this.EventApi}/getEventbyUser/${user}`)
  }





}


