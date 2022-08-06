import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { Observable, tap, switchMap, BehaviorSubject, filter } from 'rxjs';
import { Notification, PagingMetadata } from 'src/app/models';
import {
  AuthenticateService,
  NotificationService,
  SignalrService,
} from 'src/app/services';
import { NotificationListState } from '../states';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [RxState],
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
    private notificationService: NotificationService,
    private notificationListState: RxState<NotificationListState>,
    private signalRService: SignalrService
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
        var titleTab=this.getTitleTab(
          router.routerState,
          router.routerState.root
        ).join('-');
        this.pageUrl = url;
        titleService.setTitle(titleTab);
      }
    });
  }
  ngOnInit(): void {
    // this.notificationService.getNotifications().subscribe((result) => {
    //   this.notications = result.data;
    // });

    this.signalRService.startConnectionNotification();
    this.signalRService.addTranferDataNotificationTaskListener();
    // this.signalRService.addTranferDataCustomerTaskListener();
    // this.signalRService.addTranferDataUpdateCustomerTaskListener();

    this.notificationListState.connect(
      this.search$
        .pipe(switchMap(() => this.notificationService.getNotifications()))
        ,
      (_, result) => ({
        notifications: result.data,
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    this.notificationListState.connect(
      this.signalRService.subjectNotification$
        .pipe(
          tap((data) => {
            return data;
          })
        )
        // .pipe(tap((data) => console.log(data)))
        ,
      (prev, result) => ({
        notifications: [result as Notification, ...prev.notifications],
      })
    );
    this.notificationListState.connect(
      this.signalRService.subjectCustomerTask$.pipe(
        tap((data) => data as Notification)
      ),
      (prev, result) => ({
        notifications: [...prev.notifications, result],
      })
    );

  }
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

  getTitleTab(state: any, parent: any): any {
    var data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.titleTab) {
      data.push(parent.snapshot.data.titleTab);
    }

    if (state && parent) {
      data.push(...this.getTitleTab(state, state.firstChild(parent)));
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

  isShow1 = false;

  changeShow1() {
    if (this.isShow1) {
      this.isShow1 = false;
    } else this.isShow1 = true;
  }
  isShow = false;

  exit() {
    this.authService.clearToken();
    this.router.navigate(['../login'], {
      relativeTo: this.activatedRoute,
    });
  }
  search$ = new BehaviorSubject<{}>({});
  get notification$(): Observable<Notification[]> {
    return this.notificationListState.select('notifications');
  }

  get loading$(): Observable<boolean> {
    return this.notificationListState.select('loading');
  }

  get metadata$(): Observable<PagingMetadata> {
    return this.notificationListState.select('metadata');
  }

  isReadNotify(){
    console.log("shshhsh");
    this.notificationService.isReadNotification().subscribe(data=>data);
    if (this.isShow) {
      this.isShow = false;
    } else this.isShow = true;
    
  }
}
