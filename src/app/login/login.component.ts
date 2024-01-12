import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user.service';



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
  loggedInUsername: any;

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
.subscribe((resultData: any) => {
  console.log(resultData); //prints the resultData received from the HTTP POST request to the login endpoint
        

  if (resultData.status === false && resultData.message === "Incorrect password") {
    console.log("Incorrect password");
    alert("Incorrect password");
  } else if (resultData.message === "Email not exists") {
    console.log("Email not exists");
    alert("Email not exists");
  } else if (resultData.message === "Login Successful") {
    console.log("Login Successful");
    alert("Login Successful");

     // passing logged in  user to service
    this.loggedInUserId = resultData.user.userid;
    this.userService.setLoggedInUserId(this.loggedInUserId);
// Store the logged-in user ID in sessionstorage for session persistence
    sessionStorage.setItem('loggedInUser', JSON.stringify(resultData.user.userid));

    // Set the logged-in username
this.loggedInUsername = resultData.user.username;

this.userService.setLoggedInUsername(this.loggedInUsername);


//store the logged in username in sessionStorage for session persistence

sessionStorage.setItem('LOGGEDUSERNAME',JSON.stringify(this.loggedInUsername));


    // Navigate to the '/search' route upon successful login
    this.router.navigateByUrl("/search");
  } else {
    console.log("Invalid email or password");
    alert("Invalid email or password");
  }
}, (error) => {
  console.error("Error during login:", error);

});

}
}


