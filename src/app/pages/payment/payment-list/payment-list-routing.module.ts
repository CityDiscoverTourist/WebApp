import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentListComponent } from './payment-list.component';


const routes: Routes = [
  {
    path: '',
    component: PaymentListComponent,
    data: { title: 'Danh sách thanh toán', url: 'payment',titleTab:'Danh sách thanh toán' },
  },
  {
    path: 'list',
    component: PaymentListComponent,
    data: { title: 'Danh sách thanh toán', url: 'payment' ,titleTab:'Danh sách thanh toán' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentListRoutingModule { }
