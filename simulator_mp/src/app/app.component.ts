import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { IssueService } from './issue.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'List of Issues';
}
