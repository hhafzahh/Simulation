import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //create FormGroup for the login form
  myForm!: FormGroup;
  results:any = false;
  
  //dependency injection of FormBuilder as an object call fb
  constructor(private fb: FormBuilder,private authService:AuthService,private router:Router) {}

  ngOnInit() {
    this.myForm = this.fb.group({
      username:new FormControl(''),
      email:new FormControl(''),
      password: new FormControl('')
    })
}

//login function and use mongodb database authuser...
onSubmit(){
  this.authService.authUser(this.myForm.value.username,this.myForm.value.password).subscribe(data =>
    {
      this.results = data;
      console.log(this.results)
      console.log(this.results[0].auth)
      if(this.results[0].auth) {
         
        //set username, token &  role in local storage
         localStorage.setItem('username',this.results[0].username)
         localStorage.setItem('access_token', this.results[0].token)
         localStorage.setItem('role',this.results[0].role)
         console.log(this.results[0])
         //location.reload();
         //navigate to home page
         this.router.navigateByUrl('/home');
      }
      else{

        //else if not successful then alert 
        alert("Wrong Username or password")

      }

    });
}
}

