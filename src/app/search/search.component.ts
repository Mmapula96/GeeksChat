import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { Message, User } from '../usersearchfolder/searchuser';
import { WebsocketService } from '../websocket.service';
import { MessageService } from '../message.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { timestamp } from 'rxjs';
import { ThisReceiver } from '@angular/compiler';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit,OnDestroy {

// Property to hold the search input
  searchName: string ='';
  // Array to store the fetched users from the search
  users: any[]=[]; 
  // Array to store search results
  Searchuser: any[] = [];
  // Property to hold the currently logged-in user
  selectedUser: User | null = null;
  message: string = '';
   messages: any[] = [];
   convoId: string = '';
   userid: any;
   User: any;
   user2Id: any;
   conversationId: string='';
   timestamp: string = '';
loggedInUsername: any;


  constructor(public userService: UserService, 
    private router:Router,
    private dialog:MatDialog,
    private websocketService:WebsocketService,
    private messageService:MessageService,

) {
  

  
}
   // Method to handle user logout
   logout() {
    console.log('User logged out');
    // Navigate to the login page upon logout
   this.router.navigateByUrl("/login")
  }
  

  // Method to search for users based on the entered username
  searchUsers() {
    if (this.searchName) {
      this.userService.searchUsersByUsername(this.searchName).subscribe(
        // Callback function executed on successful response
        (data) => {
          console.log("these are the users: ", this.searchName);//it shows the name i searched
          // Store fetched users in the 'users' array
          this.users = data;
          // Open a dialog to display search results
          this.openDialog(data);
     
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
    }
  
  }


onUserSelected(user: User): void {
  this.selectedUser = user;
  this.convoId = this.messageService.getConversationId(user.userid);
  
  this.messageService.getMessages(this.convoId)
    .subscribe(messages => {
      this.messages = messages.map(message => {
        return {
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp,
        };
      });
    });
}

  // Method to open a dialog to display search results
  openDialog(users: any): void {
    const dialogRef = this.dialog.open(SearchResultsComponent, {  
    // Pass the search results as data to the dialog
     data: users,
  
    });
  
  }


  ngOnDestroy(): void {
    // Implement any cleanup logic if needed
    this.websocketService.disconnect();
  }

  ngOnInit() {

    // Connect to the WebSocket server
     this.websocketService.connect(() => {  
      
});
 this.loggedInUsername = this.userService.getLoggedInUsername()
 // Add debug logging
 console.log('Debug: username....', this.loggedInUsername);
      
    }

sendMessage() {
  // Check if a user is selected
  if (this.selectedUser) {
    // Trim the message content
    const trimmedMessage = this.message.trim();

    // Check if the trimmed message content is not empty
    if (trimmedMessage !== '') {
 
      const conversationId = this.messageService.getConversationId(this.selectedUser.userid);

      const newMessage: Message = {
        sender: this.userService.getLoggedInUserId(),
        content: trimmedMessage, 
        conversationId: conversationId,
        timestamp: new Date(),
       
      };

    

      // Add the new message to the UI immediately
      this.messages.push(newMessage);

      // Clear the message input field
      this.message = '';

      
      this.websocketService.sendMessage(`/app/api/messages/${conversationId}` , newMessage);
    
      
    } else {
      // Handle the case when the message content is empty
      console.error('Cannot send an empty message.');
      alert("Cannot send an empty message ")
      
    }
  } else {
    // Handle the case when no user is selected
    console.error('No user selected to send a message to.');
    alert("No user Selected to send message to")
  }
}

isDateValid(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

getMessages(conversationId: string): void {
  this.messageService.getMessages(conversationId).subscribe(
    (messages) => {
      this.messages = messages;
    },
    (error) => {
      console.error('Error fetching messages:', error);
    }
  );
}


}
