import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { IssueService } from '../issue.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'List of Issues';
  issues: any = [];

  constructor(private router: Router,
    private issuesService: IssueService) { }

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
