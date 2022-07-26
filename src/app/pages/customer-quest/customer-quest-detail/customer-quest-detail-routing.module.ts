import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerQuestDetailComponent } from './customer-quest-detail.component';

const routes: Routes = [
  {
    path: '',
  component: CustomerQuestDetailComponent,
    data: { title: 'Quay lại danh sách customer quest', url: 'customer-quest' },
  },
  {
    path: 'list',
  component: CustomerQuestDetailComponent,
    data: { title: 'Quay lại danh sách customer quest', url: 'customer-quest' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerQuestDetailRoutingModule {}
