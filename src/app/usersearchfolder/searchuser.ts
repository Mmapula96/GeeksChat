export class Searchuser {
    searchName: string ='';

    constructor() {
      this.searchName = "";
     
    }
}

export interface User{
  userId: any;
  userid:number;
  username:string;
  email:string;
  password:string;
}
export interface Message {
  sender: string;
  content: string;
}