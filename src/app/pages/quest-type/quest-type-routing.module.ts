import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestTypeComponent } from './quest-type.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: ProductListComponent,
  // },

  {
    path: '',
    component: QuestTypeComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./quest-type-list/quest-type-list.module').then(
            (m) => m.QuestTypeListModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./quest-type-list/quest-type-list.module').then(
            (m) => m.QuestTypeListModule
          ),
      },    
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestTypeRoutingModule { }
