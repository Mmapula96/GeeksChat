import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { UserService } from './user.service';
import { Message, User } from './usersearchfolder/searchuser';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
 
  private stompClient!: Stomp.Client;
  private messageSubject: Subject<any> = new Subject<any>();
  private isConnected: boolean = false;
  private users : User[] = [];
  constructor(private userService:UserService) { 
    
  }

  connect(callback?: () => void): void {
    if (!this.isConnected) {
      const socket = new SockJS('http://localhost:8080/websocket-chat');
      this.stompClient = Stomp.over(socket);

      this.stompClient.connect({}, () => {
        console.log('Connected to WebSocket');
        this.isConnected = true;
        this.subscribetoconvs();
       

        if (callback) {
          callback();
        }
      });
    }
  }
  setUsers(users : User[]){
  this.users = users;

  }
  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
      });
    }
  }

  //Method to send messages to the selcted user
  sendMessage(destination: string, message: Message): void {
    // console.log(message.timestamp);
    this.stompClient.send(destination, {}, JSON.stringify(message));
    this.messageSubject.next(message);
  }

  


//message subscription
  subscribeToConversation(conversationId: string): void {
    const conversationTopic = `/topic/messages/${conversationId}`;
    this.stompClient.subscribe(conversationTopic, (message: Stomp.Message) => {
      // Handle the received message
      this.messageSubject.next(message.body);
      const newMessage = message.body;
    
      console.log('Received message:', newMessage);
      
    });

  }

  subscribetoconvs(){
    if(this.users)
    {
      this.users.forEach((user) => {
        const conv = this.getConversationId(user.userid);
        this.subscribeToConversation(conv);
    }
    );
    }else{console.log("empty list of users found")}
  }
 
  //method to get the id's for loggedin user and selected user to start conversation
  getConversationId(user2Id: number): string {
    const user1Id = this.userService.getLoggedInUserId();
    return user1Id < user2Id ? `${user1Id}_${user2Id}` : `${user2Id}_${user1Id}`;
  }


}
