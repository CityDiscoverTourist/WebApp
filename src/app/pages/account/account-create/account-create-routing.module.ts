import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestCreateComponent } from '../../quest/quest-create/quest-create.component';

const routes: Routes = [
  {
    path: '',
    component: QuestCreateComponent,
    data: { title: 'Tạo tài khoản', url: 'create',titleTab: 'Tạo tài khoản' },
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountCreateRoutingModule { }
