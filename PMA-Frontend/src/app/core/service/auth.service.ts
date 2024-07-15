import { Injectable } from "@angular/core";
import {
  HttpClient,
} from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import {  map, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Role } from "../models/role";
import { AuthResponse } from "../models/auth-response.model";
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  private tokenExpirationTimer: any;

  readonly baseUrl = environment.apiUrl;
  private UserApi = `${this.baseUrl}/api/v1/users`;

  serverImagesUrl = `${environment.apiUrl}/static/images`

  private loggedUserSubject: BehaviorSubject<AuthResponse | null> = new BehaviorSubject(null);
  public loggedUser = this.loggedUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router,private _toast : ToastService) {
  }

  getLoggedUser() {
    return this.loggedUserSubject.value;
  }

  public setLoggeduser(payload : any){
    this.loggedUserSubject.next(payload);
  }

  register(data){
    return this.http.post(`${this.UserApi}/signup`, data)
  }
  confirm_signup(id: any, data){
    return this.http.post<{ message : string }>(`${this.UserApi}/confirm-signup/${id}`, data);
  }
  getAllSignupRequests(): Observable<[]> {
    return this.http.get<[]>(`${this.UserApi}/signup/requests`).pipe(
      map((users: any) => users.map(user => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })))
    );
  }
  adduser(data){
    return this.http.post<{ message : string }>(`${this.UserApi}/adduser`, data);
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.UserApi}/login`, { email, password }).pipe(
      map((user: any) => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })),
      tap((user) => {
        localStorage.setItem("CurrentUser", JSON.stringify(user));
        this.loggedUserSubject.next(user);
        const tokenPayload = JSON.parse(atob(user.token.split('.')[1]));
        const expirationDate = new Date(tokenPayload.exp * 1000);
        this.autoLogout(expirationDate.getTime() - new Date().getTime());
        return user;
      })
    )
  }
  updateuser(id: any, data){
    return this.http.patch<{ message : string }>(`${this.UserApi}/update/${id}`, data);
  }
  //update password
  updatePassword(data : any): Observable<{message : string}> {
    return this.http.patch<{message : string}>(`${this.UserApi}/updatePwd`, data);
  }

  //switchRoles
  switchRoles(){
    const currentUser =  localStorage.getItem("CurrentUser");
    if(currentUser == null || currentUser == undefined){
      return;
    }
    
    let new_role;
    const currentRole = JSON.parse(currentUser).roles[0];
    new_role = currentRole === Role.Engineer ? Role.TeamLeader : Role.Engineer;
    
    return this.http.post(`${this.UserApi}/roles/switch`,
      { 
        userId : this.getLoggedUser().id, 
        role : new_role 
      }
    );
  }

  updateuserRole(id: any, data){
    return this.http.patch(`${this.UserApi}/update-roles/${id}`, data);
  }
  forgotpasswd(email){
    return this.http.post<{ message : string }>(`${this.UserApi}/forgotPassword`, email
    );
  }
  checkpass(data){
    return this.http.post(`${this.UserApi}/checkpass`, data);
  }
  validateCode(data){
    return this.http.post<{ message : string }>(`${this.UserApi}/validateCode`, data);
  }
  changePswdAutorisation(id: any){
    return this.http.get(`${this.UserApi}/changePswdAutorisation/${id}`);
  }
  change_psw(data){
    return this.http.patch<{ message : string }>(`${this.UserApi}/changePwd`, data);
  }
  getallUsers(){
    return this.http.get(`${this.UserApi}/getall`).pipe(
      map((users: any) => users.map(user => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })))
    );
  }
  filter(data){
    return this.http.post(`${this.UserApi}/filter`, data);
  }
  searchUsers(data){
    return this.http.post(`${this.UserApi}/search`, data);

  }
  deleteUser(id: any){
    return this.http.delete<{ message : string }>(`${this.UserApi}/delete/${id}`);
  }
  getUserById(id: any){
    return this.http.get(`${this.UserApi}/getUserById/${id}`).pipe(
      map((user: any) => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` }))
    )
  }
  getallEngineer(): Observable<[]> {
    return this.http.get<[]>(`${this.UserApi}/getAllEng`).pipe(
      map((users: any) => users.map(user => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })))
    );


  }
  getEngineer(): Observable<[]> {
    return this.http.get<[]>(`${this.UserApi}/getEngi`).pipe(
      map((users: any) => users.map(user => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })))
    )
  }
  getAllEngineersAndTeamLeaders(){
    return this.http.get<[]>(`${this.UserApi}/getAllEngineersAndTeamLeaders`).pipe(
      map((users: any) => users.map(user => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })))
    )
  }
  getallCient(): Observable<[]> {
    return this.http.get<[]>(`${this.UserApi}/getAllClient`).pipe(
      map((users: any) => users.map(user => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })))
    );

  }
  getallTeamLeader(): Observable<[]> {
    return this.http.get<[]>(`${this.UserApi}/getAllTeamLeader`).pipe(
      map((users: any) => users.map(user => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })))
    );

  }
  setAuthTimer(expiresIn: number) {
    setTimeout(() => {
      this.logout();

    }, expiresIn * 1000);
  }
  sendMail(data){
    return this.http.post(`${this.UserApi}/email`, data);
  }


  logout() {
    localStorage.removeItem("CurrentUser");
    this.loggedUserSubject.next(null);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.router.navigate(["/authentication/signin"]);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this._toast.setSuccess("Token expired, you're logged out")
    }, expirationDuration);
  }
}
