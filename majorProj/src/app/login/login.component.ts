import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder,Validators, AbstractControl } from '@angular/forms';
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
  submitted = false;
  //dependency injection of FormBuilder as an object call fb
  constructor(private fb: FormBuilder,private authService:AuthService,private router:Router) {}

  ngOnInit() {
    this.myForm = this.fb.group({
      username: new FormControl('',Validators.required),
      email:new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
      
    })
}
// convenience getter for easy access to form fields
get f() { return this.myForm.controls; }

//login function and use mongodb database authuser...
onSubmit(){
  this.submitted = true;

  if(this.myForm.invalid){
    
    //logging for easier troubleshooting
    console.log('you have submitted an invalid form')
    return;
  }
  
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


