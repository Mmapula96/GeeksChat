import { Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../user.service';
import { Message, User } from '../usersearchfolder/searchuser';
import { WebsocketService } from '../websocket.service';
import { MessageService } from '../message.service';


@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css']
})
export class ChatlistComponent implements OnInit,OnDestroy{
  // Array to store the chat list
  Searchuser: any[] = [];

// Subject to manage the destruction of observables
  private destroy$: Subject<void> = new Subject<void>();
  // Property to hold the logged-in user ID
  loggedInUserId: any;
   
  userid:any;
  lastMessages: { [key: string]: Message } = {};

  
  
  // Event emitter to notify the search component when a user is selected
  @Output() userSelected = new EventEmitter<User>();
 
  user:any;


  constructor( private userService: UserService , 
    private websocketService : WebsocketService,
    private messageService:MessageService) {}


ngOnInit(): void {
  // Retrieve the logged-in user ID from session storage
  const storedUserString = sessionStorage.getItem('loggedInUser');
  if (storedUserString) {
    const storedUserId = JSON.parse(storedUserString);
    this.userid = storedUserId;
    console.log("LOGGED IN USER ID: ", this.userid)
  }

  // Fetch the chat list for the logged-in user
  this.getChatList(this.userid)


}

// Method to fetch and update the chat list for the logged-in user
private getChatList(userid: any) {
  console.log('Calling getChatList with userId:', userid);
  // Subscribe to the chat list updates using UserService
  this.userService.getChatList(userid).pipe(takeUntil(this.destroy$)).subscribe(
    // Callback function executed on successful response
    (updatedChatList) => {
      console.log('Received updated chat list:', updatedChatList);

      if (updatedChatList && updatedChatList.length > 0) {
        // Exclude the logged-in user from the chat list
        this.Searchuser = updatedChatList.filter(user => user.userid !== userid);
        this.websocketService.setUsers(this.Searchuser);
        console.log('Chat list updated:', this.userid);

        // Fetch last messages after updating the chat list
        this.getLastMessages();
        
      
      } else {
        console.warn('Received empty or invalid chat list for userId:', userid);
      }
    },
    // Callback function executed in case of an error
    (error) => {
      console.error('Error updating chat list:', error);
    }
  );
}

  // Method to handle the selection of a user from the chat list
  selectUser(user: User): void {
    console.log('Selected User:', user); 
    // Emit an event to notify the search component about the selected user
    this.userSelected.emit(user);
  }

  //method to destroy the component
  ngOnDestroy(): void {
     // Unsubscribe and complete the Subject to avoid memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
  getLastMessages(): void {
    // Fetch and store the last message for each user
    this.Searchuser.forEach((user: any) => {
      const convoId = this.messageService.getConversationId(user.userid);
      
      this.messageService.getLastMessage(convoId).subscribe(
        (lastMessage) => {
          console.log('Conversation ID:', convoId);
          console.log('Last Message:', lastMessage);
  
          // Check if lastMessage is not null or undefined before assignment
          if (lastMessage) {
            this.lastMessages[user.userid] = lastMessage;
          } else {
            console.warn('No last message found for conversation ID:', convoId);
          }
        },
        (error) => {
          console.error('Error fetching last message for conversation ID:', convoId, error);
        },
        () => {
          // Add this block to log completion of the observable
          console.log('Observable completed for conversation ID:', convoId);
          console.log('lastMessages:', this.lastMessages);
        }
      );
    });
}

}

