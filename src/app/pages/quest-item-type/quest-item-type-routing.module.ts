import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestItemTypeComponent } from './quest-item-type.component';

const routes: Routes = [
  {
    path: '',
    component: QuestItemTypeComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./quest-item-type-list/quest-item-type-list.module').then(
            (m) => m.QuestItemTypeListModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./quest-item-type-list/quest-item-type-list.module').then(
            (m) => m.QuestItemTypeListModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestItemTypeRoutingModule {}
