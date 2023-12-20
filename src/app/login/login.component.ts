import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../usersearchfolder/searchuser';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
    // Declare properties to hold user input data
  email: string = "";
  password: string = "";
  loggedInUserId: any;

// Inject/add necessary services (Router, HttpClient, UserService)
  constructor(private router: Router, private http: HttpClient, private userService: UserService) {}
  
 // Method for login 
  login() {
    // Prepare data to be sent in the HTTP POST request
    let bodyData = {
      "email": this.email,
      "password": this.password
    };

// Make an HTTP POST request to the login endpoint
    this.http.post("http://localhost:8080/api/v1/user/login", bodyData)
      .subscribe((resultData:any) => {
        console.log(resultData); //prints the resultData received from the HTTP POST request to the login endpoint
        
        // passing logged in  user to service
        this.loggedInUserId = resultData.user.userid;
        this.userService.setLoggedInUserId(this.loggedInUserId);

        if (resultData.message === "Email not exists") {
          alert("Email not exists");
        } else if (resultData.message === "Login Successful") {
          alert("Login Successful");

          // Store the logged-in user ID in local storage for session persistence
          sessionStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUserId));
          
          // Navigate to the '/search' route upon successful login
          this.router.navigateByUrl("/search");
        } else {
          alert("Invalid email or password");
        }
      }, (error) => {
        console.error("Error during login:", error);
        // Handle error cases if needed
      });
  }
}
