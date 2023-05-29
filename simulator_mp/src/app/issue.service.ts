import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private headers!: HttpHeaders;

  getAllIssuesUrl: string = "http://localhost:3000/api/getAllIssues";
  createIssueUrl: string = "http://localhost:3000/api/createIssue";
  getIssueObjUrl: string = "http://localhost:3000/api/getIssue";


  constructor(private http: HttpClient) { }

  getAllIssues() {
    return this.http.get<any[]>(this.getAllIssuesUrl);
  }

  //Retrieve single issue
  getIssueObj(id: number) {
    return this.http.get<any[]>(this.getIssueObjUrl + "/" + id)
  }


  //create issue
  createIssue(
    OccuranceDateTime: string,
    RequestorName: string,
    Description: string,
    Area: string,
    Team: string,
    Status: string,
    Remarks: string
  ) {
    return this.http.post<any[]>(this.createIssueUrl, {
      'occuranceDateTime': OccuranceDateTime,
      'requestorName': RequestorName,
      'description': Description,
      'area': Area,
      'team': Team,
      'status': Status,
      'remarks': Remarks
    });
  }

  //Update
  // updateIssue(issue){
  //   console.log(this.getIssueObjUrl)
  // }
  
  updateIssueById(id: number, occuranceDateTime: string, requestorName: string, description: string, area: string,team: string, status: string, remarks: string) {
    return this.http.put<any[]>(this.getIssueObjUrl + "/" + id, {
      'occuranceDateTime': occuranceDateTime,
      'requestorName': requestorName,
      'description': description,
      'area': area,
      'team': team,
      'status': status,
      'remarks': remarks
    });
  }

  // updateIssueById(payload: any) {
  //   return this.http.put<any[]>(this.getIssueObjUrl + "/" + payload._id, payload, {headers: this.headers})
  // }

    //delete issue
    deleteIssueById(id: number) {
      return this.http.delete<any[]>(this.getIssueObjUrl + "/" + id);
    }
  
}
