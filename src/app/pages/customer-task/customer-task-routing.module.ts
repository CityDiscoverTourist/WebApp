import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerTaskComponent } from './customer-task.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerTaskComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./customer-task-list/customer-task-list.module').then(
            (m) => m.CustomerTaskListModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./customer-task-list/customer-task-list.module').then(
            (m) => m.CustomerTaskListModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerTaskRoutingModule {}
