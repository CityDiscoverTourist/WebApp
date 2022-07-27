import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthenticateService, NotificationService } from 'src/app/services';
import { Notification } from 'src/app/models';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit {
  notications: Notification[] = [];
  public focus: any;
  public listTitles: any[] = [];
  public location: Location;
  public url = '';
  public pageTitle = '';
  public pageUrl = '';
  constructor(
    titleService: Title,
    private authService: AuthenticateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService
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
  ngOnInit(): void {
    this.notificationService.getNotifications().subscribe((result) => {
      this.notications = result.data;
    });
  }

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

  isShow = false;

  changeShow() {
    if (this.isShow) {
      this.isShow = false;
    } else this.isShow = true;
  }
  isShow1 = false;

  changeShow1() {
    if (this.isShow1) {
      this.isShow1 = false;
    } else this.isShow1 = true;
  }
  exit() {
    this.authService.clearToken();
    this.router.navigate(['../login'], {
      relativeTo: this.activatedRoute,
    });
  }
}
