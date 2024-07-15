import { AuthService } from "../service/auth.service";
import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastService } from "../service/toast.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authServ: AuthService,
    private _toast : ToastService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          this.authServ.logout();
          location.reload();
        }
        this._toast.setError(err.error.message);
        return throwError(err);
      })
    );
  }
}
