import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  // { path: '/admin/dashboard', title: 'Bảng điều khiển',  icon: 'ni-tv-2 text-primary', class: '' },

  // { path: './quest-type', title: 'Quest Type',  icon:'ni-planet text-blue', class: '' },
  { path: '/admin/dashboard', title: 'Bảng điều khiển',  icon: '', class: 'bi bi-layout-wtf' },
  { path: './quest', title: 'Quest',  icon:'ni-planet text-blue', class: '' },
  { path: '/admin/quest-type', title: 'Thể loại Quest',  icon:'ni-planet text-blue', class: '' },
  { path: '/admin/quest', title: 'Khu vực',  icon:'ni-planet text-blue', class: '' },

  { path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' },
];

// export const ROUTES: RouteInfo[] = [
//   { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
//   { path: '/icons', title: 'Icons',  icon:'ni-planet text-blue', class: '' },
//   { path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' },
//   { path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '' },
//   { path: '/tables', title: 'Tables',  icon:'ni-bullet-list-67 text-red', class: '' },
//   { path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' },
//   { path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '' }
// ];

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
