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
      // {
      //   path: ':id',
      //   component: ProductDetailComponent,
      // },
      {
        path: 'edit',
        // component: ProductCreateComponent,
        loadChildren:()=>
        import('./quest-type-edit/quest-type-edit.module').then(m=>m.QuestTypeEditModule)
      },
      {
        path: 'create',
        // component: ProductCreateComponent,
        loadChildren:()=>
        import('./quest-type-create/quest-type-create.module').then(m=>m.QuestTypeCreateModule)
      },
      {
        path: ':id',
        // component: ProductCreateComponent,
        loadChildren:()=>
        import('./quest-type-edit/quest-type-edit.module').then(m=>m.QuestTypeEditModule)      },
      // {
      //   path: ':id/edit',
      //   component: ProductEditComponent,
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestTypeRoutingModule { }
