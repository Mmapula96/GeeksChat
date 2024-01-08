import { DatePipe } from "@angular/common";

export class Searchuser {
    userid(userid: any) {
      throw new Error('Method not implemented.');
    }
    searchName: string ='';

    constructor() {
      this.searchName = "";
     
    }
}

export interface User{
  userid:number;
  username:string;
  email:string;
  password:string;
}

export interface Message {
  sender: string;
  content: string;
 conversationId: string;
//timestamp:Date,
}