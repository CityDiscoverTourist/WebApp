import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimGuard } from 'src/app/guards/claim.guard';
import { CustomerComponent } from './customer.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    canActivate: [ClaimGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./customer-list/customer-list.module').then(
            (m) => m.CustomerListModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./customer-list/customer-list.module').then(
            (m) => m.CustomerListModule
          ),
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./customer-detail/customer-detail.module').then(
            (m) => m.CustomerDetailModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
