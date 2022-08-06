import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDetailComponent } from './customer-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerDetailComponent,
    data: { title: 'Quay lại danh sách khách hàng', url: 'customer',titleTab:'Chi tiết khách hàng' },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerDetailRoutingModule { }
