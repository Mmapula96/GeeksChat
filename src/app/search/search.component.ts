import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { User } from '../usersearchfolder/searchuser';
import { WebsocketService } from '../websocket.service';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit,OnDestroy {

   // Method to handle user logout
logout() {
  console.log('User logged out');
  // Navigate to the login page upon logout
 this.router.navigateByUrl("/login")
}

// Property to hold the search input
  searchName: string ='';
  // Array to store the fetched users from the search
  users: any[]=[]; 
  // Array to store search results
  Searchuser: any[] = [];
  // Property to hold the currently logged-in user
  selectedUser: User | null = null;
  message: string = '';
  
  userId:any;
   messages: string[] = [];
 

  constructor(private userService: UserService, 
    private router:Router,
    private dialog:MatDialog,
    private websocketService:WebsocketService
) {
 
}
  

  // Method to search for users based on the entered username
  searchUsers() {
    if (this.searchName) {
      this.userService.searchUsersByUsername(this.searchName).subscribe(
        // Callback function executed on successful response
        (data) => {
          console.log("this is the user: ", data);//it shows the name i searched

        //   // Filter out the logged-in user from the search results
        // const loggedInUserId = this.userService.getLoggedInUserId();
        // this.users = data.filter((user) => user.searchName !== loggedInUserId);
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

   // Method to handle user selection from the search results
  onUserSelected(user: User): void {
    this.selectedUser = user;

  }

  // Method to open a dialog to display search results
  openDialog(users: any[]): void {
    const dialogRef = this.dialog.open(SearchResultsComponent, {  
    // Pass the search results as data to the dialog
     data: users,
  
    });

   
  
  }


  ngOnDestroy(): void {
    // Implement any cleanup logic if needed
    this.websocketService.disconnect();
  }

  ngOnInit(){
    this.websocketService.connect(() => {
      this.websocketService.getMessages().subscribe((msg: any) => {
        console.log(msg);
        this.messages.push(msg);

      });
    });

  }



 // Method to send a message
 sendMessage() {
  // Check if a user is selected
  if (this.selectedUser) {
    // Assuming you have a service to handle message sending, call it here
    this.websocketService.sendMessage('/topic/messages', this.message);

    // Clear the message input field
    this.message = '';
 
  } else {
    // Handle the case when no user is selected
    console.error('No user selected to send a message to.');
  }


}


}
