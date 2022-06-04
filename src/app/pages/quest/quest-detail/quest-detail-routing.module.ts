import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestEditComponent } from '../quest-edit/quest-edit.component';
import { QuestEditModule } from '../quest-edit/quest-edit.module';
import { QuestDetailComponent } from './quest-detail.component';
import { QuestItemComponent } from './quest-item/quest-item.component';

const routes: Routes = [
  {
    path: '',
    component: QuestDetailComponent,
    // children: [

    //   {
    //     path: 'quest-item',
    //     loadChildren: () =>
    //       import('./quest-item/quest-item.module').then(
    //         (m) => m.QuestItemModule
    //       ),
    //   }
    // ],
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
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestDetailRoutingModule {}
