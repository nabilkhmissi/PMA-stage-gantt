import { formatDate } from "@angular/common";
export class LeaveReport {
  id: number;
  img: string;
  name: string;
  date: string;
  department: string;
  type: string;
  noOfDays: string;
  remaining: string;
  total: string;
  totalTaken: string;
  carryOver: string;

  constructor(leaves) {
    {
      this.id = leaves.id || this.getRandomID();
      this.img = leaves.avatar || "assets/images/user/usrbig1.jpg";
      this.name = leaves.name || "";
      this.date = leaves.date || "";
      this.department = leaves.department || "";
      this.type = leaves.type || "";
      this.noOfDays = leaves.noOfDays || "";
      this.remaining = leaves.remaining || "";
      this.total = leaves.total || "";
      this.totalTaken = leaves.totalTaken || "";
      this.carryOver = leaves.carryOver || "";
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
