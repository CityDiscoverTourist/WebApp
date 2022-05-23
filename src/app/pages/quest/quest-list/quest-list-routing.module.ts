import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestListComponent } from './quest-list.component';

const routes: Routes = [
  {
    path: '',
    component: QuestListComponent,
  },
  {
    path: 'list',
    component: QuestListComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestListRoutingModule { }
