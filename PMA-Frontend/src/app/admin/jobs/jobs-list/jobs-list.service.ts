import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { JobsList } from "./jobs-list.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
@Injectable()
export class JobsListService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = "assets/data/jobs-list.json";
  isTblLoading = true;
  dataChange: BehaviorSubject<JobsList[]> = new BehaviorSubject<JobsList[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): JobsList[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllJobsLists(): void {
    this.subs.sink = this.httpClient.get<JobsList[]>(this.API_URL).subscribe(
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
  addJobsList(jobsList: JobsList): void {
    this.dialogData = jobsList;

    /*  this.httpClient.post(this.API_URL, jobsList).subscribe(data => {
      this.dialogData = jobsList;
      },
      (err: HttpErrorResponse) => {
     // error code here
    });*/
  }
  updateJobsList(jobsList: JobsList): void {
    this.dialogData = jobsList;

    /* this.httpClient.put(this.API_URL + jobsList.id, jobsList).subscribe(data => {
      this.dialogData = jobsList;
    },
    (err: HttpErrorResponse) => {
      // error code here
    }
  );*/
  }
  deleteJobsList(id: number): void {
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
