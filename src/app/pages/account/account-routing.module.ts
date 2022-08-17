import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: AccountComponent,
//     data: { title: 'Tạo tài khoản', url: 'create', titleTab: 'Tạo tài khoản' },
//   },
//   {
//     path: 'create',
//     component: AccountComponent,
//     data: { title: 'Tạo tài khoản', url: 'create', titleTab: 'Tạo tài khoản' },
//   },
// ];


const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./account-create/account-create.module').then(
            (m) => m.AccountCreateModule
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./account-create/account-create.module').then(
            (m) => m.AccountCreateModule
          ),
      }, 
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
