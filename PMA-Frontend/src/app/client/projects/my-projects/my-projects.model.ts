import { formatDate } from "@angular/common";
import { Data } from "@angular/router";
export class MyProjects {
  Projectname:String
    description:String
    status: String
    //dealdline: { type: Date },
    dateFin: String
    type: String




    progress: Number
  constructor(myProjects) {
    {
      this.Projectname = myProjects.Projectname
      this.description = myProjects.description ;
      this.type = myProjects.type ;
      this.dateFin = formatDate(new Date(), "yyyy-MM-dd", "en") ;
      this.status = myProjects.status;
      this.progress=myProjects.progress
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
