import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { IssueService } from '../issue.service';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})
export class IssuesComponent implements OnInit {
 //issuesForm!: FormGroup;
  issue: any = {}

  //IMPORTANT: If html uses the value property, FormControl is needed
  issuesForm = new FormGroup({
    occuranceDateTime: new FormControl,
    requestorName: new FormControl,
    description: new FormControl,
    area: new FormControl,
    team: new FormControl,
    status: new FormControl,
    remarks: new FormControl
  })

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private issuesService: IssueService
  ) { }


  ngOnInit(): void {
    sessionStorage.getItem("issueId")
    console.log(sessionStorage.getItem("issueId"), "sessionstorageID")

    // this.issuesForm.patchValue({
    //   OccuranceDateTime: this.issuesForm.value.OccuranceDateTime,
    //   RequestorName: this.issuesForm.value.RequestorName,
    //   Description: this.issuesForm.value.Description,
    //   Area: this.issuesForm.value.Area,
    //   Status: this.issuesForm.value.Status,
    //   Remarks: this.issuesForm.value.Remarks
    // })

    this.issuesService.getIssueObj(this.route.snapshot.params.id).subscribe(issue => {
      this.issue = issue;
      console.log(issue, "resultIssuesObj")
      this.issuesForm = new FormGroup({
        occuranceDateTime: new FormControl(this.issue.occuranceDateTime),
        requestorName: new FormControl(this.issue.requestorName),
        description: new FormControl(this.issue.description),
        area: new FormControl(this.issue.area),
        team: new FormControl(this.issue.team),
        status: new FormControl(this.issue.status),
        remarks: new FormControl(this.issue.remarks)
        
      //   // this.issuesForm.value.RequestorName,
      //   // this.issuesForm.value.Description,
      //   // this.issuesForm.value.Area,
      //   // this.issuesForm.value.Status,
      //   // this.issuesForm.value.Remarks

      })
    });

    // this.issuesForm = this.fb.group({
    //   occuranceDateTime: '',
    //   requestorName: '',
    //   description: '',
    //   area: '',
    //   status: '',
    //   remarks: ''
    // });
  }


  //Create
  onSubmit() {
    this.issuesService.createIssue(
      this.issuesForm.value.occuranceDateTime,
      this.issuesForm.value.requestorName,
      this.issuesForm.value.description,
      this.issuesForm.value.area,
      this.issuesForm.value.team,
      this.issuesForm.value.status,
      this.issuesForm.value.remarks
    )
      .subscribe(results => {
        location.reload();
      });

    alert("Created");
    this.router.navigateByUrl('');
    //location.reload();
  }


  //Update
  updateIssueById(id: number, occuranceDateTime: string, requestorName: string, description: string, area: string,team: string, status: string, remarks: string) {
    this.issuesService.updateIssueById(id, occuranceDateTime, requestorName, description, area, team,status, remarks).subscribe(issue => {
      console.log(issue, "results")
      location.reload();
    })
  }

  onItemChange(value: any) {
    var radioValue = value;
    console.log(" Value is : ", radioValue);
    // sessionStorage.setItem(bankValue, value)
    // console.log(sessionStorage.getItem(value))
  }

  // public patchIssues(issue:any){
  //   this.issuesForm.patchValue(issue)
  // }

  // onSubmitUpdate() {
  //   this.issuesService.updateIssueById(this.issuesForm.value).subscribe(res => {
  //     console.log('Hotel Details Updated');
  //     location.reload();
  // })
  // }


  onSubmitUpdate() {
    this.updateIssueById(
      this.route.snapshot.params.id,
      this.issuesForm.value.occuranceDateTime,
      this.issuesForm.value.requestorName,
      this.issuesForm.value.description,
      this.issuesForm.value.area,
      this.issuesForm.value.team,
      this.issuesForm.value.status,
      this.issuesForm.value.remarks,

      // this.route.snapshot.params.id,
      // this.issuesForm.value.occuranceDateTime,
      // this.issuesForm.value.requestorName,
      // this.issuesForm.value.description,
      // this.issuesForm.value.area,
      // this.issuesForm.value.status,
      // this.issuesForm.value.remarks

      // this.route.snapshot.params.id,
      // this.issue.occurenceDateTime,
      // this.issue.requestorName,
      // this.issue.description,
      // this.issue.area,
      // this.issue.status,
      // this.issue.remarks

      // this.route.snapshot.params.id,
      // this.issue.occurenceDateTime = this.issuesForm.value.occurenceDateTime,
      // this.issue.requestorName = this.issuesForm.value.requestorName,
      // this.issue.description = this.issuesForm.value.description,
      // this.issue.area = this.issuesForm.value.area,
      // this.issue.status = this.issuesForm.value.status,
      // this.issue.remarks = this.issuesForm.value.remarks
    )
    //this.issuesForm -> capture what is newly inputed
    //this.issues -> capture what is aleady there
    //console.log(this.issue, "issue@")
    console.log(this.issuesForm.value, "feffwfw")
    console.log(this.issuesForm.value.occuranceDateTime, this.issuesForm.value.requestorName, this.issuesForm.value.description,
      this.issuesForm.value.area, this.issuesForm.value.team, this.issuesForm.value.status, this.issuesForm.value.remarks, "update")

    alert("Update Successfully!");
    this.router.navigateByUrl('')
  }

  // onSubmitUpdate() {
  //   this.updateIssueById(
  //     this.route.snapshot.params.id,
  //     this.issuesForm.value.OccuranceDateTime,
  //     this.issuesForm.value.RequestorName,
  //     this.issuesForm.value.Description,
  //     this.issuesForm.value.Area,
  //     this.issuesForm.value.Status,
  //     this.issuesForm.value.Remarks
  //   )
  //   console.log(this.route.snapshot.params.id,this.issuesForm.value.OccuranceDateTime, this.issuesForm.value.RequestorName, this.issuesForm.value.Description,
  //     this.issuesForm.value.Area, this.issuesForm.value.Status, this.issuesForm.value.Remarks, "update")

  //   alert("Update Successfully!");
  //   this.router.navigateByUrl('')
  // }


  checkSubmitType() {
    return (sessionStorage.getItem("issueId") != null)
  }

  deleteIssue(id: number) {
    this.issuesService.deleteIssueById(id).subscribe(issue => {
      console.log(id);
      alert("Delete Successfully!");
      this.router.navigateByUrl('');
      //location.reload();
    });
  }


}
