import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestListComponent } from './quest-list.component';

const routes: Routes = [
  {
    path: '',
    component: QuestListComponent,
    data: { title: 'Danh sách quest', url: 'quest',titleTab:'Danh sách quest' }
  },
  {
    path: 'list',
    component: QuestListComponent,
    data: { title: 'Danh sách quest', url: 'quest' ,titleTab:'Danh sách quest' }
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestListRoutingModule { }
