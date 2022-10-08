import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  issuesUrl:string = "http://localhost:3000/api/issues";

  constructor(private http:HttpClient) { }

  getAllIssues() {
    return this.http.get<any[]>(this.issuesUrl);
    }
}
