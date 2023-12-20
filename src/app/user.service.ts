import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Searchuser } from './usersearchfolder/searchuser';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  
  private apiUrl = 'http://localhost:8080/api/v1/user'; 
  private selectedUserIdSource = new BehaviorSubject<number | null>(null);
  selectedUserId$ = this.selectedUserIdSource.asObservable();

  userId: any;
  baseUrl: any;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<Searchuser[]> {
    return this.http.get<Searchuser[]>(`${this.apiUrl}/all`);
  }

  searchUsersByUsername(name: string): Observable<Searchuser[]> {
    return this.http.get<Searchuser[]>(`${this.apiUrl}/search/${name}`);
  }

  
  // Method to add a contact to the chat list
  addContactToChatList(loggedInUserId: number, contactUserId: number): Observable<any> {
    const url = `${this.apiUrl}/${loggedInUserId}/add-contact/${contactUserId}`;
  
    return this.http.post(url, {});
  }
  
  getChatList(loggedInUserId: number): Observable<any[]> {
    const url = `${this.apiUrl}/${loggedInUserId}/chat-list`;
    return this.http.get<any[]>(url);
  }

  getSelectedUser(selectedUserId: number): Observable<any[]> {
    const url = `${this.baseUrl}/selected-user/${selectedUserId}`;
    return this.http.get<any[]>(url);
  }

 
  setLoggedInUserId(loggedInUserId: any) {
    this.userId = loggedInUserId;
  }

  // getLoggedInUserId() : any{
  //   const userString = localStorage.getItem('loggedInUser');
  //   if(userString !== null) {
  //     const stringObj = JSON.parse(userString);
  //     return stringObj;

  //   }  
  // }

  getLoggedInUserId() : any{
    const id = sessionStorage.getItem('loggedInUser');
    return id;
  }



  selectUser(userId: number): void {
    this.selectedUserIdSource.next(userId);
  }
}