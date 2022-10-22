import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
export class User {
  constructor(
    public _id: any,
    public firstName: string,
    public lastName: string,
    public mobileNum: string,
    public email: string,
    public username: string,
    public password: string,
    public team: string
  ) {
  }
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  //edit form formgroup
  editForm!: FormGroup;

  //create a user object
  user: any = {};
  results: any;

  //setting authenticated as false first
  checkIfAuthenticated: boolean = false;

  //get the username stored in the local storage
  storedUsername = localStorage.getItem("username");
  constructor(private authService: AuthService, private fb: FormBuilder, private modalService: NgbModal) {

    //get userdetails based on username
    this.authService.getUserDetails(this.storedUsername).subscribe(data => {
      this.user = data;

      //check if user is logged in and return boolean based on the values..
      this.checkIfAuthenticated = this.authService.isAuthenticated;
      console.log(this.user)
    });
  }
  ngOnInit(): void {
    this.editForm = this.fb.group({
      _id: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      mobileNum: new FormControl(''),
      email: new FormControl(''),
      username: new FormControl(''),
      password: new FormControl(''),
      team: new FormControl(''),
    });
  }

  //open modal to edit form function. using modal to edit userdetails
  //user will not be able to edit the objectID & Team
  openEdit(targetModal: any, i: User) {
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue({
      _id: i._id,
      firstName: i.firstName,
      lastName: i.lastName,
      mobileNum: i.mobileNum,
      email: i.email,
      username: i.username,
      password: i.password,
      team: i.team
    });
  }

  //to save the changes and edit in the database.
  onSave() {
    this.modalService.dismissAll();//dismiss modal
    this.authService.editUser(this.editForm.value).subscribe((data) => {
      this.results = data;
      console.log(this.results.firstName);
      location.reload();
    })
  }

}
