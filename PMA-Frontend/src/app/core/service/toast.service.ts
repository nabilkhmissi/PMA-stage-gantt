import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn : "root"
})
export class ToastService {
    constructor(){}

    private successSubject = new BehaviorSubject<String | null>(null)
    private errorSubject = new BehaviorSubject<String | null>(null)

    success$ = this.successSubject.asObservable();
    error$ = this.errorSubject.asObservable();
    toastDelay = 4000;
    private successTimeout: any;
    private errorTimeout: any;
  
    setError(text: string) {
      this.errorSubject.next(text);
      this.clearError();
    }
  
    setSuccess(text: string) {
      this.successSubject.next(text);
      this.clearSuccess();
    }
  
    clearSuccess() {
      if (this.successTimeout) {
        clearTimeout(this.successTimeout);
      }
      this.successTimeout = setTimeout(() => {
        this.successSubject.next(null);
      }, this.toastDelay);
    }
  
    clearError() {
      if (this.errorTimeout) {
        clearTimeout(this.errorTimeout);
      }
      this.errorTimeout = setTimeout(() => {
        this.errorSubject.next(null);
      }, this.toastDelay);
    }
}