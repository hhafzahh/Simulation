import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ConfirmedValidator } from './custom.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  results: any = false;
  submitted = false;
  //create a formgroup object called myForm
  myForm!: FormGroup;
 
  //dependency injection of FormBuilder as an object call fb
  constructor(private fb: FormBuilder, private auth: AuthService,private router:Router) { }

  ngOnInit() {

    //Construct the FormGroup object using FormBuilder (myForm)
    this.myForm = this.fb.group({
      firstName: new FormControl('',Validators.required),
      lastName: new FormControl('',Validators.required),
      mobileNum: new FormControl('',Validators.required),
      username: new FormControl('',Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      team: new FormControl('',Validators.required),
      password: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(20)]),
      confirm_password: new FormControl('',Validators.required),
    },
    {
      validator: ConfirmedValidator('password', 'confirm_password')
    }
  );
}

  // convenience getter for easy access to form fields
  get f() { 
    console.log(this.myForm.controls)
    return this.myForm.controls; }
  
  // submit button to register user.
  onSubmit() {
    this.submitted = true;

    if(this.myForm.invalid){
      
      //logging for easier troubleshooting
      console.log('you have submitted an invalid form')
      
      return;
    }
  
    console.log(this.myForm.value);
    this.auth.regUser(this.myForm.value)
     
  }

  onItemChange(value: any) {
    var radioValue = value;
    console.log(" Value is : ", radioValue);
  }

}
