import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  results: any = [];
  user: any = {};

  NAME_KEY = 'username';
  TOKEN_KEY = 'access_token';
  ROLE_KEY = 'role'

  authuserUrl: string = 'http://localhost:3000/api/authuser/';
  regUserUrl: string = 'http://localhost:3000/api/reguser/';
  getUsersUrl: string = 'http://localhost:3000/api/users/';
  profileUrl: string = 'http://localhost:3000/api/profile/';

  

  constructor(private http: HttpClient, private router: Router) { }

  //register user into mongodb based on the form details
  regUser(user: any) {
    return this.http.post(this.regUserUrl, user).subscribe((data) => {
      this.results = data;
      console.log(this.results[0]);
      if (this.results[0].auth = "true") {
        alert("registered");
        localStorage.setItem(this.NAME_KEY, this.results[0].username);
        this.router.navigateByUrl('');

      }
      else {
        alert("not successful")
      }
    });
  }


  //authenticates user based on the mongodb based on the form details
  authUser(username: string,email:string, pw: string) {
    return this.http.post<any[]>(this.authuserUrl, {
      username: username,
      email:email,
      password: pw
    })
  }

  //get all users
  getAllUsers() {
    return this.http.get<any[]>(this.getUsersUrl);
  }

  //delete user by id
  deleteUser(id: any) {
    return this.http.delete<any[]>(this.getUsersUrl + id);
  }

  //get name from localstorage
  get name() {
    return localStorage.getItem(this.NAME_KEY);
  }

  //check if user is logged in 
  get isAuthenticated() { 
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  //logout function
  logout() {
    localStorage.removeItem(this.NAME_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    

  }

  //get user details 
  getUserDetails() {
    return this.http.get<any[]>(this.profileUrl);
  }

  //edit user function based on user id
  editUser(user: any) {
    console.log(this.profileUrl + user._id);
    return this.http.put<any[]>(this.profileUrl + user._id, user);
  }

  //add user function
  addUser(user: any) {
    return this.http.post(this.getUsersUrl, user);
  }

  IsLoggedIn(){
    return !!localStorage.getItem(this.TOKEN_KEY);

  }

  //to be used in auth.interceptor.ts
  getAccessToken(){
    return localStorage.getItem('access_token');
  }



}
