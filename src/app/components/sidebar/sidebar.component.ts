import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/admin/quest', title: 'Danh sách quest',  icon: 'ni-tv-2 text-primary', class: '' },
  { path: '/admin/quest/create', title: 'Quay lại danh sách quests',  icon:'bi bi-chevron-left', class: 'bi bi-chevron-left' },
  { path: '/admin/quest/id', title: 'Quay lại danh sách quest',  icon:'', class: '' },
  { path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '' },
  { path: '/tables', title: 'Tables',  icon:'ni-bullet-list-67 text-red', class: '' },
  { path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' },
  { path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '' }
];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {



  constructor(private router: Router) { }

  ngOnInit() {

  }
}
