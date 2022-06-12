import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestItemComponent } from './quest-item.component';

const routes: Routes = [
  {
    path: '',
    component: QuestItemComponent,
    children: [
      {
        path: 'create',
        loadChildren: () =>
          import('./quest-item-create/quest-item-create.module').then(
            (m) => m.QuestItemCreateModule
          ),
      },
      {
        path: ':id/edit',
        loadChildren: () =>
          import('./quest-item-edit/quest-item-edit.module').then(
            (m) => m.QuestItemEditModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestItemRoutingModule { }
