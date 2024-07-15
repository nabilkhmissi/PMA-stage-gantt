import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  id: any;
  CurrentUser: any;
  fullname:String;
  phone:String;
  role:string;
  isdisable:true
  userdata
  SecuForm:UntypedFormGroup;
  accForm:UntypedFormGroup
  constructor(
    private authServ: AuthService,
    private fb: UntypedFormBuilder,
    private _toast : ToastService
  ) {
    this.SecuForm = this.fb.group({
      oldPassword: ["", [Validators.required]],
      newPassword: ["", [Validators.required]],
    });
    this.accForm = this.fb.group({
       fullName: ["",[Validators.required]],
       City: ["", [Validators.required]],
       phone: ["", [Validators.required]],
       Country:["", [Validators.required]],
       Address:["", [Validators.required]],
       nationality:["", [Validators.required]],
       Img:[""]
      })
  }
  ngOnInit() {
    
  this.CurrentUser=this.authServ.getLoggedUser();
  this.authServ.getUserById(this.CurrentUser.id).subscribe({
  next:(res)=>{
    this.userdata=res
    this.accForm=this.fb.group({
      fullName: [this.userdata.fullName,[Validators.required]],
      City: ["", [Validators.required]],
      phone: [this.userdata.phone, [Validators.required]],
      Country:["", [Validators.required]],
      Address:[this.userdata.address, [Validators.required]],
      nationality:[this.userdata.nationality, [Validators.required]],
      Img:[""]
    })
  }
})
}

getuser(id:any){
this.authServ.getUserById(id).subscribe({
  next:(res)=>{

this.CurrentUser= res;
}
})
}

SaveSecSettings(){
  let passwordchange = {
    "userId" : this.CurrentUser.id,
    "oldPassword":this.SecuForm.value.oldPassword,
    "newPassword":this.SecuForm.value.newPassword
  }
  
 this.authServ.updatePassword(passwordchange).subscribe({
  next:(res)=>{
    this._toast.setSuccess(res.message);
    this.SecuForm.reset();
    this.SecuForm.controls.oldPassword.setErrors(null);
    this.SecuForm.controls.newPassword.setErrors(null)
  }
})
}

getClassNme():string

    {if(this.CurrentUser.roles=="Admin")
  {
    return 'l-bg-purple-dark'
  }else if(this.CurrentUser.roles=="Engineer"||this.CurrentUser.roles=="Team Leader"){
    return 'l-bg-green-dark'
  }
  else
  {return 'l-bg-cyan'}
}


Save(){
 let formdata = new FormData();
  let add=this.accForm.value.Country+" ,"+this.accForm.value.City+" ,"+this.accForm.value.Address
  formdata.append("fullName",this.accForm.value.fullName)
  formdata.append("phone",this.accForm.value.phone)
  formdata.append("address",add)
  formdata.append("nationality",this.accForm.value.nationality)
  if(this.accForm.value.Img){
    formdata.append("image",this.accForm.value.Img,this.accForm.value.Img.name)
  }

 this.authServ.updateuser(this.CurrentUser.id,formdata).subscribe({
  next:(res)=>{
    this._toast.setSuccess(res.message);
    this.getuser(this.CurrentUser.id);
    add=""
    this.accForm.controls.City.setErrors(null);
    this.accForm.controls.Country.setErrors(null)
    this.accForm.controls.phone.setErrors(null)
    this.accForm.controls.fullName.setErrors(null)
    this.accForm.controls.Address.setErrors(null)
    this.accForm.controls.nationality.setErrors(null)
  }
})
}
}


