import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerListComponent,
    data: { title: 'Danh sách khách hàng', url: 'customer' },
  },
  {
    path: 'list',
    component: CustomerListComponent,
    data: { title: 'Danh sách khách hàng', url: 'customer' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerListRoutingModule {}
