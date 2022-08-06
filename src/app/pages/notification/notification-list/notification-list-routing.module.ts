import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationListComponent } from './notification-list.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationListComponent,
    data: { title: 'Danh sách thông báo', url: 'notification', titleTab: 'Danh sách thông báo', },
  },
  {
    path: 'list',
    component: NotificationListComponent,
    data: { title: 'Danh sách thông báo', url: 'notification' , titleTab: 'Danh sách thông báo', },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationListRoutingModule { }
