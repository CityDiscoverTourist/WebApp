import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationListComponent } from './notification-list.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationListComponent,
    data: { title: 'Danh sách thông báo', url: 'notification' },
  },
  {
    path: 'list',
    component: NotificationListComponent,
    data: { title: 'Danh sách thông báo', url: 'notification' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationListRoutingModule { }
