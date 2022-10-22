import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  name:any;
  check: boolean = false;
  userRole:any;
  
  constructor(private auth:AuthService,private router:Router) {
      this.name = this.auth.name;
      this.check = this.auth.isAuthenticated;

   }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('team');
    console.log(this.userRole);
  }
  logout(){
    this.auth.logout();
    this.router.navigateByUrl('');
  }
 

}
