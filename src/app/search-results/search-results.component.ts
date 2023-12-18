import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../usersearchfolder/searchuser';


@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit{

// Property to hold the user data received from the search component
  users: User;
  dialogRef: any;
  ContactService: any;
  Searhuser: any[]=[];
  selectedUser: string = '';
 
 
    
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private router:Router,private userService : UserService) {
    // 'data' will now contain the information passed to the dialog
    this.users = data[0];   
  }

  
  ngOnInit(): void {
    console.log(this.users);

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
      (response) => {
        console.log('Contact added successfully!');
         // Display an alert indicating successful contact addition
        alert("Contact Added")
      },
      (error) => {
        console.error('Error adding contact:', error);
        // Handle error, if needed
      }
    );
  } 
  
  }


