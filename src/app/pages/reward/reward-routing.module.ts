import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RewardComponent } from './reward.component';

const routes: Routes = [
  {
    path: '',
    component: RewardComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./reward-list/reward-list.module').then(
            (m) => m.RewardListModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
        import('./reward-list/reward-list.module').then(
          (m) => m.RewardListModule
        ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardRoutingModule { }
