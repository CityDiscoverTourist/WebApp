import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationComponent } from './notification.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./notification-list/notification-list.module').then(
            (m) => m.NotificationListModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
        import('./notification-list/notification-list.module').then(
          (m) => m.NotificationListModule
        ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationRoutingModule {}
