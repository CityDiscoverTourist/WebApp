import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestItemTypeListComponent } from './quest-item-type-list.component';

const routes: Routes = [
  {
    path: '',
    component: QuestItemTypeListComponent,
  },
  {
    path: 'list',
    component: QuestItemTypeListComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestItemTypeListRoutingModule { }
