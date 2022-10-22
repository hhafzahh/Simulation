import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  results: any = false;

  //create a formgroup object called myForm
  myForm!: FormGroup;

  //dependency injection of FormBuilder as an object call fb
  constructor(private fb: FormBuilder, private auth: AuthService,private router:Router) { }

  ngOnInit() {

    //Construct the FormGroup object using FormBuilder (myForm)
    this.myForm = this.fb.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      mobileNum: new FormControl(''),
      username: new FormControl(''),
      email: new FormControl(''),
      team: new FormControl(''),
      pwSet: this.fb.group(
        {
          password: new FormControl(
            ''),
          retype: new FormControl(
            ''
          ),
        },
      ),
    });
  }

  // submit button to register user.
  onSubmit() {
    console.log(this.myForm.value);
    this.auth.regUser(this.myForm.value)
     
  }
}
