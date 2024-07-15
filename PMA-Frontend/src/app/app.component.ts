import { Component, OnInit } from "@angular/core";
import { Event, Router, NavigationStart, NavigationEnd } from "@angular/router";
import { AuthService } from "./core/service/auth.service";
import { Role } from "./core/models/role";
import { ToastService } from "./core/service/toast.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  currentUrl: string;
  constructor(public _router: Router, 
    private authservice:AuthService,
    private router: Router,
    private _toast : ToastService
    ) {
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf("/") + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
      }
      window.scrollTo(0, 0);
    });
  }

  success$ = this._toast.success$;
  error$ = this._toast.error$;
  
  ngOnInit(){
    this.checkUserSession();
  }
  checkUserSession(){
    const currentUser = localStorage.getItem("CurrentUser");
    if(!currentUser) {
      this.authservice.logout();
      this.router.navigate(["/authentication/signin"]);
      return;
    }
    this.authservice.setLoggeduser(JSON.parse(currentUser));
    this.autoLogout();

    const role = this.authservice.getLoggedUser().roles[0];
    if (role == Role.Admin) {
      this.router.navigate(["/admin/dashboard/main"]);
    } else if (role == Role.Engineer){
      this.router.navigate(["/employee/dashboard"]);
    } else if (role == Role.Client) {
      this.router.navigate(["/client/dashboard"]);
    }
    else if(role==Role.TeamLeader){
      this.router.navigate(["/TeamLeader/dashboard"])
    }
    else{
      this.router.navigate(["authentication/signin"])
    }    
  }

  closeSuccessToast(){
    this._toast.clearSuccess();
  }
  closeErrorToast(){
    this._toast.clearError();
  }  

  autoLogout(){
    const payload = this.authservice.getLoggedUser();
    if (payload && payload.token) {
      const tokenPayload = JSON.parse(atob(payload.token.split('.')[1]));
      const expirationDate = new Date(tokenPayload.exp * 1000);
      const now = new Date();
      if (expirationDate > now) {
        this.authservice.autoLogout(expirationDate.getTime() - now.getTime());
      } else {
        this.authservice.logout();
        this._toast.setSuccess("Token expired, you're logged out")
      }
    }
  }
}
