import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services';
declare type Player={
  email:string;
  point:string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
   totalValue = '';
   totalQuest = '';
   totalUser = '';
   listTopUserPoint:Player[]=[];
   listTopQuest:string[]=[];

  constructor(
    private httpClient: HttpClient,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getTotalRevenue().subscribe(data=>this.totalValue=data);
    this.dashboardService.getTotalQuest().subscribe(data=>this.totalQuest=data);
    this.dashboardService.getTotalUser().subscribe(data=>this.totalUser=data);
    this.dashboardService.getTopPlayer().subscribe(data=>this.listTopUserPoint=data);
    this.dashboardService.getTopQuestPlay().subscribe(data=>this.listTopQuest=data);
  }
}
