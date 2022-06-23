import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerQuestComponent } from './customer-quest.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerQuestComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./customer-quest-list/customer-quest-list.module').then(
            (m) => m.CustomerQuestListModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./customer-quest-list/customer-quest-list.module').then(
            (m) => m.CustomerQuestListModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerQuestRoutingModule {}
