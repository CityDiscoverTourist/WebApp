import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestDetailComponent } from './quest-detail.component';
import { QuestItemComponent } from './quest-item/quest-item.component';

const routes: Routes = [
  {
    path: '',
    component: QuestDetailComponent,
  },
  {
    path: 'quest-item',
    component: QuestItemComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./quest-item/quest-item.module').then(
            (m) => m.QuestItemModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestDetailRoutingModule {}
