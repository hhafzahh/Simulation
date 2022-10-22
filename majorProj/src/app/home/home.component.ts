import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { IssueService } from '../issue.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'List of Issues';
  issues: any = [];
  check: boolean = false;
  constructor(private router: Router,
    private issuesService: IssueService,private auth:AuthService) { 
      this.check = this.auth.isAuthenticated;
    }

  ngOnInit(issues: any = []): void {
    // Retrieve posts from the API
    this.issuesService.getAllIssues().subscribe(issues => { this.issues = issues; })
  }

  public createIssue() {
    sessionStorage.clear()
    this.router.navigateByUrl('/issueForm/')
  }
  
  public goEditIssueForm(issue: any) {
    console.log(issue);
    sessionStorage.setItem('issueId', issue._id)
    this.router.navigateByUrl('/issueForm/' + issue._id)
  }


  

}
