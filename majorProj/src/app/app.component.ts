import { Component } from '@angular/core';
import { IssueService } from './issue.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'List of Issues';

//   issues: any = [];

//  constructor(private issueService: IssueService) { 
//  // Retrieve posts from the API
//  this.issueService.getAllIssues().subscribe(issues => {this.issues = issues;});
//  }
}
