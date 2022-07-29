import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationListRoutingModule } from './notification-list-routing.module';
import { NotificationListComponent } from './notification-list.component';


@NgModule({
  declarations: [
    NotificationListComponent
  ],
  imports: [
    CommonModule,
    NotificationListRoutingModule
  ]
})
export class NotificationListModule { }
