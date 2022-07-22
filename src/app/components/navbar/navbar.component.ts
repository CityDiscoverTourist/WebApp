import { Component, ElementRef, OnInit } from '@angular/core';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { ROUTES } from '../sidebar/sidebar.component';
import { Title } from '@angular/platform-browser';
import { AuthenticateService } from 'src/app/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public focus: any;
  public listTitles: any[] = [];
  public location: Location;
  public url = '';
  public pageTitle = '';
  public pageUrl = '';
  constructor(
    titleService: Title,
    router: Router,
    private auth: AuthenticateService
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        var title = this.getTitle(
          router.routerState,
          router.routerState.root
        ).join('-');
        this.pageTitle = title;
        var url = this.getUrl(router.routerState, router.routerState.root).join(
          '-'
        );
        this.pageUrl = url;
        titleService.setTitle(title);
      }
    });
  }
  ngOnInit(): void {}

  // collect that title data properties from all child routes
  // there might be a better way but this worked for me
  getTitle(state: any, parent: any): any {
    var data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }
  getUrl(state: any, parent: any): any {
    var data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.url) {
      data.push(parent.snapshot.data.url);
    }

    if (state && parent) {
      data.push(...this.getUrl(state, state.firstChild(parent)));
    }
    return data;
  }

  
}
