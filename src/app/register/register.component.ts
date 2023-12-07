import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
// Properties to hold user input data
  username: string="";
  email: string ="";
  password:string="";

// Constructor to inject required services (Router, HttpClient)
  constructor(private router:Router,private http:HttpClient){

  }
  //register method
  save(){
    let bodyData={
      // Prepare data to be sent in the HTTP POST request
      "username":this.username,
      "email":this.email,
      "password":this.password

    };
    // Make an HTTP POST request to the user registration endpoint
    this.http.post("http://localhost:8080/api/v1/user/save",bodyData,{responseType:'text'}).subscribe((resultData:any)=>{
      console.log(resultData);
      // Display an alert indicating successful user registration

      alert("User Registered Successfully");
      // Navigate to the '/login' route after user registration
      this.router.navigateByUrl("/login");

    });
  }
}