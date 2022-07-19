import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  isClose = false;
  isClose1 = false;
  isClose2 = false;
  constructor() {}
  ngOnInit(): void {}
  changeShow() {
    if (this.isClose) {
      this.isClose = false;
    } else this.isClose = true;
  }
  changeShow1() {
    if (this.isClose1) {
      this.isClose1 = false;
    } else this.isClose1 = true;
  }
  changeShow2() {
    if (this.isClose2) {
      this.isClose2 = false;
    } else this.isClose2 = true;
  }
}
