import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountCreateComponent } from './account-create/account-create.component';

const routes: Routes = [
  {
    path: '',
    component: AccountCreateComponent,
    data: { title: 'Tạo tài khoản', url: 'create', titleTab: 'Tạo tài khoản' },
  },
  {
    path: 'create',
    component: AccountCreateComponent,
    data: { title: 'Tạo tài khoản', url: 'create', titleTab: 'Tạo tài khoản' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
