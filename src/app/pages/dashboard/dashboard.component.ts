import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DashboardService } from 'src/app/services';
declare type Player = {
  email: string;
  point: string;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  totalValue = '';
  totalQuest = '';
  totalUser = '';
  listTopUserPoint: Player[] = [];
  listTopQuest: string[] = [];
  valueRevenue: any[];

  listTopQuestByMonth: any[] = [];
  listTopQuestByYear: any[] = [];

  years: { id: string; value: string }[] = [
    { id: `${new Date().getFullYear()}`, value: `${new Date().getFullYear()}` },
    {
      id: `${Number(new Date().getFullYear() + 1)}`,
      value: `${Number(new Date().getFullYear() + 1)}`,
    },
  ];
  months: { id: number; value: number }[] = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
    { id: 4, value: 4 },
    { id: 5, value: 5 },
    { id: 6, value: 6 },
    { id: 7, value: 7 },
    { id: 8, value: 8 },
    { id: 9, value: 9 },
    { id: 10, value: 10 },
    { id: 11, value: 11 },
    { id: 12, value: 12 },
  ];
  constructor(
    private httpClient: HttpClient,
    private dashboardService: DashboardService
  ) {
    this.dashboardService.getTotalRevenueByYear('2022').subscribe((data) => {
      this.valueRevenue = data.map((i, index) => ({
        name: `Tháng ${index + 1}`,
        value: i,
      }));
      setTimeout(() => Object.assign(this.valueRevenue), 1000);
    });
  }

  //chart

  productSales: any[];
  // productSalesMulti: any[];

  // view: number[] = [700, 370];
  view: any = [900, 500];

  // options
  legendTitle: string = 'Doanh thu';
  legendTitleMulti: string = 'Months';
  //
  legendPosition: any = 'right'; // ['right', 'below']
  legend: boolean = true;

  xAxis: boolean = true;
  yAxis: boolean = true;

  yAxisLabel: string = 'Sales';
  // xAxisLabel: string = 'Products';
  xAxisLabel: string = 'Doanh thu';
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;

  maxXAxisTickLength: number = 30;
  maxYAxisTickLength: number = 30;
  trimXAxisTicks: boolean = false;
  trimYAxisTicks: boolean = false;
  rotateXAxisTicks: boolean = false;

  xAxisTicks: any[] = [
    'Genre 1',
    'Genre 2',
    'Genre 3',
    'Genre 4',
    'Genre 5',
    'Genre 6',
    'Genre 7',
  ];
  yAxisTicks: any[] = [2500000, 5000000, 10000000, 25000000];

  animations: boolean = true; // animations on load

  showGridLines: boolean = true; // grid lines

  showDataLabel: boolean = true; // numbers on bars

  gradient: boolean = false;
  // colorScheme:any = {
  //   domain: ['#704FC4', '#4B852C', '#B67A3D', '#5B6FC8', '#25706F']
  // };
  //
  schemeType: any = 'ordinal'; // 'ordinal' or 'linear'

  activeEntries: any[] = ['book'];
  barPadding: number = 5;
  tooltipDisabled: boolean = false;

  yScaleMax: number = 9000;

  roundEdges: boolean = false;

  onSelect(event: any) {
    console.log(event);
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  formatString(input: string): string {
    return input.toUpperCase();
  }

  formatNumber(input: number): number {
    return input;
  }
  //

  ngOnInit(): void {
    this.dashboardService
      .getTotalUser()
      .subscribe((data) => (this.totalUser = data));
    this.dashboardService
      .getTopPlayer()
      .subscribe((data) => (this.listTopUserPoint = data));
    this.dashboardService
      .getTotalRevenue()
      .subscribe((data) => (this.totalValue = data));
    this.dashboardService
      .getTotalQuest()
      .subscribe((data) => (this.totalQuest = data));
    this.dashboardService
      .getTopQuestPlay()
      .subscribe((data) => (this.listTopQuest = data));

    this.dashboardService
      .getTopQuestByMonth('8', '2022')
      .subscribe((data) => (this.listTopQuestByMonth = data));
    this.dashboardService
      .getTopQuestByYear('2022')
      .subscribe((data) => (this.listTopQuestByYear = data));
  }

  search$ = new BehaviorSubject<{ year: string }>({ year: '' });
  searchForm = new FormGroup({
    year: new FormControl(),
  });
  searchTopQuestByMonth$ = new BehaviorSubject<{
    monthTopQuestByMonth: string;
    yearTopQuestByMonth: string;
  }>({ monthTopQuestByMonth: '', yearTopQuestByMonth: '' });
  searchFormTopQuestByMonth = new FormGroup({
    monthTopQuestByMonth: new FormControl(),
    yearTopQuestByMonth: new FormControl(),
  });

  searchRevenueByYear() {
    this.search$.subscribe((data) => {
      if (Number(data.year) > 0) {
        this.dashboardService
          .getTotalRevenueByYear(data.year)
          .subscribe((data) => {
            this.valueRevenue = data.map((i, index) => ({
              name: `Tháng ${index + 1}`,
              value: i,
            }));
            setTimeout(() => Object.assign(this.valueRevenue), 1000);
          });
      }
    });
  }
  searchTopQuestByMonth() {
    this.searchTopQuestByMonth$.subscribe((data) => {
      if (
        Number(data.monthTopQuestByMonth) ||
        Number(data.yearTopQuestByMonth) ||
        (Number(data.monthTopQuestByMonth) && Number(data.yearTopQuestByMonth))
      ) {
        this.dashboardService
          .getTopQuestByMonth(
            data.monthTopQuestByMonth,
            data.yearTopQuestByMonth
          )
          .subscribe((data) => {
            this.listTopQuestByMonth = data;
          });
      }
    });
  }

  searchTopQuestByYear$ = new BehaviorSubject<{
    yearTopQuest: string;
  }>({ yearTopQuest: '' });

  searchFormTopQuestByYear = new FormGroup({
    yearTopQuest: new FormControl(),
  });

  searchTopQuestByYear() {
    this.searchTopQuestByYear$.subscribe((data) => {
      console.log(data);
      if (Number(data.yearTopQuest)) {
        this.dashboardService
          .getTopQuestByYear(data.yearTopQuest)
          .subscribe((data) => {
            this.listTopQuestByYear = data;
          });
      }
    });
  }
}
