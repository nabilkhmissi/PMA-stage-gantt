import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Candidates } from "./candidates.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
@Injectable()
export class CandidatesService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = "assets/data/candidates.json";
  isTblLoading = true;
  dataChange: BehaviorSubject<Candidates[]> = new BehaviorSubject<Candidates[]>(
    []
  );
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Candidates[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllCandidatess(): void {
    this.subs.sink = this.httpClient.get<Candidates[]>(this.API_URL).subscribe(
      (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + " " + error.message);
      }
    );
  }
  addCandidates(candidates: Candidates): void {
    this.dialogData = candidates;

    /*  this.httpClient.post(this.API_URL, candidates).subscribe(data => {
      this.dialogData = candidates;
      },
      (err: HttpErrorResponse) => {
     // error code here
    });*/
  }
  updateCandidates(candidates: Candidates): void {
    this.dialogData = candidates;

    /* this.httpClient.put(this.API_URL + candidates.id, candidates).subscribe(data => {
      this.dialogData = candidates;
    },
    (err: HttpErrorResponse) => {
      // error code here
    }
  );*/
  }
  deleteCandidates(id: number): void {
    console.log(id);

    /*  this.httpClient.delete(this.API_URL + id).subscribe(data => {
      console.log(id);
      },
      (err: HttpErrorResponse) => {
         // error code here
      }
    );*/
  }
}
