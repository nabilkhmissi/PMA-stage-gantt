import { formatDate } from "@angular/common";
export class Leads {
  id: number;
  img: string;
  name: string;
  email: string;
  role: string;
  mobile: string;
  department: string;
  project: string;
  constructor(leads) {
    {
      this.id = leads.id || this.getRandomID();
      this.img = leads.avatar || "assets/images/user/user1.jpg";
      this.name = leads.name || "";
      this.email = leads.email || "";
      this.role = leads.role || "";
      this.mobile = leads.mobile || "";
      this.department = leads.department || "";
      this.project = leads.project || "";
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
