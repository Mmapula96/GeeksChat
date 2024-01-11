

export class Searchuser {
    username: any;
  
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
 timestamp:Date;
}