import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerTaskListComponent } from './customer-task-list.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerTaskListComponent,
    data:{title:'Danh sách customer task',url:'customer-task'},
  },
  {
    path: 'list',
    component: CustomerTaskListComponent,
    data:{title:'Danh sách customer task',url:'customer-task'},
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerTaskListRoutingModule { }
