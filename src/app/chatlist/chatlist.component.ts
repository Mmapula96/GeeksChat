import { Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../user.service';
import { User } from '../usersearchfolder/searchuser';


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
  loggedInUserId: any;
   // Property to hold the logged-in user ID
  userId: any;
  
  // Event emitter to notify the search component when a user is selected
  @Output() userSelected = new EventEmitter<User>();
 
  user:any;

  constructor( private userService: UserService) {}

  ngOnInit(): void {
    // Retrieve the logged-in user ID from local storage
    const storedUserString = localStorage.getItem('loggedInUser')
    if(storedUserString) {
      const storedUserId = JSON.parse(storedUserString);
      this.userId = storedUserId;
      console.log("LOGGED IN USER ID: ", this.userId)
    }
 // Fetch the chat list for the logged-in user
    this.getChatList(this.userId);
  }

  // Method to fetch and update the chat list for the logged-in user
  private getChatList(userId: any) {
    console.log('Calling getChatList with userId:', userId);
  // Subscribe to the chat list updates using UserService
    this.userService.getChatList(userId).pipe(takeUntil(this.destroy$)).subscribe(
        // Callback function executed on successful response
      (updatedChatList) => {
        console.log('Received updated chat list:', updatedChatList);
  
        if (updatedChatList && updatedChatList.length > 0) {
          // Exclude the logged-in user from the chat list
          this.Searchuser = updatedChatList.filter(user => user.id !== userId);
  
          console.log('Chat list updated:', this.userId);
         
        } else {
          console.warn('Received empty or invalid chat list for userId:', userId);
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
 
  
}