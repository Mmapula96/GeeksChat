import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, filter, merge } from 'rxjs';
import { Message } from './usersearchfolder/searchuser';
import { UserService } from './user.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  private conversations: { [key: string]: BehaviorSubject<Message[]> } = {};
  private apiUrl = 'http://localhost:8080/api/messages';


  constructor(private userService : UserService,private http:HttpClient,private websocketService:WebsocketService){
    
  }
  // Method to add a message to a conversation
  getOrCreateConversation(user2Id: number): BehaviorSubject<Message[]> {
    const user1Id = this.userService.getLoggedInUserId();
    const convoId = user1Id < user2Id ? `${user1Id}_${user2Id}` : `${user2Id}_${user1Id}`;

    // Check if the conversation already exists
    if (!this.conversations[convoId]) {
      // If the conversation doesn't exist, create a new one
      this.conversations[convoId] = new BehaviorSubject<Message[]>([]);
    }

    return this.conversations[convoId];
  }

  // Method to add a message to a conversation or create a new one if it doesn't exist
  addMessageToConversation(user2Id: number, message: Message): void {
    const conversation = this.getOrCreateConversation(user2Id);

    // Add the new message to the conversation
    const currentMessages = conversation.value;
    const updatedMessages = [...currentMessages, message];
    conversation.next(updatedMessages);
// Send the message through WebSocket
this.websocketService.sendMessage('/app/topic/messages', message);
console.log('sent message',message.content)
  }

  getMessages(conversationId: string): Observable<Message[]> {
  
    const url = `${this.apiUrl}/messages/${conversationId}`;
    return this.http.get<Message[]>(url);
  
  }

  // Method to get conversation messages for a specific conversation
  getConversationMessages(user2Id: number): Observable<Message[]> {
    const conversation = this.getOrCreateConversation(user2Id);
    return conversation.asObservable();
  }

  // getMessages(conversationId: string): Observable<Message[]> {
  //   // Fetch initial messages using HTTP
  // const initialMessages$ = this.http.get<Message[]>(`${this.apiUrl}/messages/${conversationId}`);

  // // Subscribe to WebSocket updates
  // const websocketMessages$ = this.websocketService.getMessages().pipe(
  //   filter((message) => message.conversationId === conversationId)
  // );

  // // Merge HTTP and WebSocket messages
  // return merge(initialMessages$, websocketMessages$);
  // }
  // getMessages(conversationId: string): Observable<Message[]> {
  //   const url = `${this.apiUrl}/messages/${conversationId}`;
  //   return this.http.get<Message[]>(url);
  // }

  // Method to get a conversation ID based on two user IDs
  getConversationId(user2Id: number): string {
    const user1Id = this.userService.getLoggedInUserId();
    return user1Id < user2Id ? `${user1Id}_${user2Id}` : `${user2Id}_${user1Id}`;
  }

  
  
}




