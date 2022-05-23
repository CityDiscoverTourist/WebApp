import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestListComponent } from './quest-list/quest-list.component';
import { QuestComponent } from './quest.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: QuestListComponent,
  // },

  {
    path: '',
    component: QuestComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./quest-list/quest-list.module').then(
            (m) => m.QuestListModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./quest-list/quest-list.module').then(
            (m) => m.QuestListModule
          ),
      },
      {
        path: 'edit',
        // component: ProductCreateComponent,
        loadChildren:()=>
        import('./quest-edit/quest-edit.module').then(m=>m.QuestEditModule)
      },
      {
        path: 'create',
        // component: ProductCreateComponent,
        loadChildren:()=>
        import('./quest-create/quest-create.module').then(m=>m.QuestCreateModule)
      },
      {
        path: ':id',
        // component: ProductCreateComponent,
        loadChildren:()=>
        import('./quest-edit/quest-edit.module').then(m=>m.QuestEditModule)      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestRoutingModule { }
