import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentListComponent } from './payment-list.component';


const routes: Routes = [
  {
    path: '',
    component: PaymentListComponent,
    data: { title: 'Danh sách thanh toán', url: 'payment' },
  },
  {
    path: 'list',
    component: PaymentListComponent,
    data: { title: 'Danh sách thanh toán', url: 'payment' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentListRoutingModule { }
