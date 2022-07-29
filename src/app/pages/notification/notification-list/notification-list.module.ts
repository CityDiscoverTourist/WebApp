import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationListRoutingModule } from './notification-list-routing.module';
import { NotificationListComponent } from './notification-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
const lib = [NgxDatatableModule];

@NgModule({
  declarations: [NotificationListComponent],
  imports: [CommonModule, NotificationListRoutingModule,...lib],
})
export class NotificationListModule {}
