import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService:AuthService,private router:Router){}
  canActivate() {
    let Role = localStorage.getItem(this.authService.ROLE_KEY);
    if(Role == "Ops Team"){
      return true;
    }
    else{
      alert("You dont have admin rights")
      this.router.navigate(['']);
      return false;
    }

   
  }
  
}
