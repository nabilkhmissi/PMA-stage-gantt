import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
//import { ChangeEvent } from "@ckeditor/ckeditor5-angular";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AuthService } from "src/app/core/service/auth.service";
@Component({
  selector: "app-compose",
  templateUrl: "./compose.component.html",
  styleUrls: ["./compose.component.scss"],
})
export class ComposeComponent {
  public Editor = ClassicEditor;
  selectedOption
  body
  mailform: UntypedFormGroup;
  A="Dear Madam, Sir, I request an intervention on site (address/ remote) in the following days because [....... ]. We would be available to meet with you [specify days and date] from [time].Would you please confirm your availability ? "
 B="Hello Sir, Madam \nOn behalf of Mr Hedi JAIET and myself, I would like to send you this e-mail to express our thanks for your time during the meetings we held on [date] at the premises of [address] Indeed the exchanges were short, but very rich which allowed us to present [Heart of the presentation],So we reiterate our willingness to work with you.Once again, thank you for your kind welcome and interest.I remain as well as the entire Prologic team at your disposal for any need or clarification."
C="Thank you for our meeting on [Date]. We enjoyed our exchange and would love to be able to move forward together to carry out your project. Not having had a return to my previous email, I take the liberty of relaunching you."
D="Dear Madam, Dear Sir, As part of our [Project Name] project, we are in the process of [Indicate task being performed]. In this regard, I would need additional information [….. ].Please get back to us as soon as possible"
E="Dear Madam, Dear Sir,As part of our [Project Name] project, we need [Application] In this regard, I tried to contact you several times at [Phone number] but you were unreachable.Please come back to us as soon as possible."
F="Dear Madam, Dear Sir, As part of our [Project Name] project, we have scheduled an online meeting [ZOOM, Teams… + link].The meeting started [ over due ] ago  but I can’t reach you. This meeting will be rescheduled, please provide another date"
H="Dear Madam, Dear Sir, I want to follow up on what we said earlier about a problem at the level of [ ….. ].I confirm the final and complete resolution of the breakdown .I have noted your concerns about [ if there is another concern] and how this penalizes your activity.As mentioned above, you will find attached a proposal to help you solve your problem.Pending our next appointment, I remain available to answer your questions"


constructor(private fb: UntypedFormBuilder,private authSev:AuthService,    private snackBar: MatSnackBar,
  ) {
  this.mailform = this.fb.group({
    /*       projectID: ["", [Validators.required]],
     */      TO: ["", [Validators.required]],
     Subject : ["", [Validators.required]],
          message: [this.body, [Validators.required]],

        });
 }

 getfilteredFormData($event:any) {
  // selectedContinent would be undefined if no option is selected
  // therefore, we return all of the continents
//  console.log(this.selectedProject);
console.log("cccc",$event);


  if ($event.value=="Intervention request") {
   // console.log("bbb");

    this.body= this.A}
    else if($event.value==="Thanking"){
      this.body= this.B
    }
    else if($event.value==="Follow-up calls"){
      this.body= this.C
    }
    else if($event.value==="Information request"){
      this.body=this.D
    }
    else if($event.value==="Customer unreachable by phone"){
      this.body=this.E
    }
    else if($event.value==="Customer unreachable (online meeting)"){
      this.body=this.F
    }
    else if($event.value==="Closing the intervention"){
      this.body=this.H
    }

}
resetForm(){
  this.mailform.reset();


Object.keys(this.mailform.controls).forEach(key => {
this.mailform.get(key).setErrors(null) ;
});
}
showNotification(colorName, text, placementFrom, placementAlign) {
  this.snackBar.open(text, '', {
    duration: 2000,
    verticalPosition: placementFrom,
    horizontalPosition: placementAlign,
    panelClass: colorName,
  });
}
onSubmit() {

let data={
  "to":this.mailform.value.TO,
  "subject":this.mailform.value.Subject,
  "message":this.mailform.value.message

}
//console.log(data);
this.authSev.sendMail(data).subscribe({
  next:(res)=>{
   // this.mailform.reset();
    this.resettForm();

    this.showNotification(
      'snackbar-success',
      res,
      'bottom',
      'center'
    );

  },
  error:(err)=>{
   // console.log(err);
 this.resettForm();

   this.showNotification(
    'snackbar-success',
    "Mail sent with success",
    'top',
    'right'
  );

  }
})



}
resettForm() {

    this.mailform.reset();


          //this.mailform.reset();
  Object.keys(this.mailform.controls).forEach(key => {
    this.mailform.get(key).setErrors(null);
      //this.mailform.get(key).setValidators(null)

  });

  }
}

