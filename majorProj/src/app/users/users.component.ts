//this component should only be accessible by the Portal Admin (to edit/delete/create users.) [edit user to change its access role/team]
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';

//user class
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
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  //setting authenticated as false first
  checkIfAuthenticated: boolean = false;

  //2 forms - edit and create new form
  myForm!: FormGroup;
  editMyForm!: FormGroup;

  users: any;
  results: any;
  closeResult!: string;

  constructor(private userService: AuthService, private fb: FormBuilder, private modalService: NgbModal) {

    //get all users to show in table for frontend
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
      console.log(this.users)

      //set checkIfAuthenticated as the value in service. Purpose of this : To condition if user is priveledged enough to see the nav bar and the issues.
      this.checkIfAuthenticated = this.userService.isAuthenticated;

    })
  }



  ngOnInit(): void {
    //Construct the FormGroup object using FormBuilder (myForm)
    this.myForm = this.fb.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      mobileNum: new FormControl(''),
      username: new FormControl(''),
      email: new FormControl(''),
      team: new FormControl(''),
      password: new FormControl('')

    });

    //Construct the FormGroup object using FormBuilder (editMyForm)
    this.editMyForm = this.fb.group({
      _id: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      mobileNum: new FormControl(''),
      username: new FormControl(''),
      email: new FormControl(''),
      team: new FormControl(''),
      password: new FormControl(''),

    })
  }
  //To delete a user in the table
  delete(id: any) {
    this.userService.deleteUser(id).subscribe((data) => {
      location.reload();
      console.log(id)
    });
  }

  //Edit Form
  //When user clicks the edit action button in the table, modal opens, the values in the current should be shown in the form
  //admin can only edit the role of the others users
  openModal(targetModel: any, user: User) {
    this.modalService.open(targetModel, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    //using patchValue to assign the name with the value
    this.editMyForm.patchValue({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNum: user.mobileNum,
      email: user.email,
      username: user.username,
      password: user.password,
      team: user.team
    });
  }

  //open the create new modal
  open(targetModal: any) {
    this.modalService.open(targetModal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //edit function
  edit() {

    //to dismiss the modal
    this.modalService.dismissAll();

    //using mongodb to perform edit user function
    this.userService.editUser(this.editMyForm.value).subscribe((data) => {
      this.results = data;
      console.log(this.editMyForm.value)

    })
    window.location.reload();
  }

  //create function
  create() {

    //using mongodb to perfrom add user function 
    this.userService.addUser(this.myForm.value).subscribe((data) => {
      this.results = data;
      console.log(this.results)
      window.location.reload();
    });

    //dismiss modal
    this.modalService.dismissAll();
    window.location.reload();
  }

  onItemChange(value: any) {
    var radioValue = value;
    console.log(" Value is : ", radioValue);
  }

}
