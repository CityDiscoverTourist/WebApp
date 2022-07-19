import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
   totalValue = '';
   totalQuest = '';
   totalUser = '';

  constructor(
    private httpClient: HttpClient,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getTotalRevenue().subscribe(data=>this.totalValue=data);
    this.dashboardService.getTotalQuest().subscribe(data=>this.totalQuest=data);
    this.dashboardService.getTotalUser().subscribe(data=>this.totalUser=data);
  }
}
