import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestTypeListComponent } from './quest-type-list.component';

const routes: Routes = [
  {
    path: '',
    component: QuestTypeListComponent,
  },
  {
    path: 'list',
    component: QuestTypeListComponent,
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestTypeListRoutingModule { }
