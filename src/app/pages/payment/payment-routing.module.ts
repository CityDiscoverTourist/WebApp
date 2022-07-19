import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./payment-list/payment-list.module').then(
            (m) => m.PaymentListModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./payment-list/payment-list.module').then(
            (m) => m.PaymentListModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
