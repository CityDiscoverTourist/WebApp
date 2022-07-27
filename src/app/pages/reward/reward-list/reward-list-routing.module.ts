import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RewardListComponent } from './reward-list.component';

const routes: Routes = [
  {
    path: '',
    component: RewardListComponent,
    data: { title: 'Danh sách quà tặng', url: 'reward' },
  },
  {
    path: 'list',
    component: RewardListComponent,
    data: { title: 'Danh sách quà tặng', url: 'reward' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardListRoutingModule { }
