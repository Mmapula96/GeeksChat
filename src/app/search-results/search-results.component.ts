import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { User } from '../usersearchfolder/searchuser';


@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit{

// Property to hold the user data received from the search component
  // users: User;
  dialogRef: any;
  // Searhuser: any[]=[];
  selectedUser: string = '';
  users: User[];
  
  Searhuser: User[] = [];
 
    
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private userService : UserService) {
    // 'data' will now contain the information passed to the dialog
    this.users = data;
    this.Searhuser = this.users;  

  }

  
  ngOnInit(): void {
    console.log(this.data);

  }
 
   // Method to add a contact to the chat list
  addContact(user : User) {
    console.log(this.userService.getLoggedInUserId() + "  " +user.userid)
     // Get the logged-in user ID
    const loggedInUserId = this.userService.getLoggedInUserId(); 
  // Get the contact user ID
    const contactUserId = user.userid;  

    // Call the UserService method to add the contact to the chat list
    this.userService.addContactToChatList(loggedInUserId, contactUserId).subscribe(
      // Callback function executed on successful response
      () => {
        console.log('Contact added successfully!');
         // Display an alert indicating successful contact addition
        alert("Contact Added")
      },
      (error) => {
        console.error('Error adding contact:', error);
        alert("you can't add yourself as a contact")
        // Handle error, if needed
      }
    );
  } 
  
  }


