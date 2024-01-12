import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable,  tap } from 'rxjs';
import { Message } from './usersearchfolder/searchuser';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
 
  
  // private conversations: { [key: string]: BehaviorSubject<Message[]> } = {};
  private apiUrl = 'http://localhost:8080/api/messages';



  constructor(private userService : UserService,private http:HttpClient){
    
  }


  // Method to get a conversation ID based on two user IDs
  getConversationId(user2Id: number): string {
    const user1Id = this.userService.getLoggedInUserId();
    return user1Id < user2Id ? `${user1Id}_${user2Id}` : `${user2Id}_${user1Id}`;
  }

  //method to get the old messages and the current messages
  getMessages(conversationId: string): Observable<any[]> {
    const url = `${this.apiUrl}/${conversationId}`; 
    return this.http.get<any[]>(url);
  }

//method to get the last message sent or recieved on the chatlist
  getLastMessage(conversationId: string): Observable<Message> {
    return this.http.get<Message>(`${this.apiUrl}/last/${conversationId}`)
      .pipe(
        tap(data => console.log('Received last message:', data))
      );
  }

  
  
  
}




