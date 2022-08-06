import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestTypeListComponent } from './quest-type-list.component';

const routes: Routes = [

  {
    path: '',
    component: QuestTypeListComponent,
    data: { title: 'Danh sách loại quest', url: 'quest-type',titleTab:'Danh sách loại quest' }
  },
  {
    path: 'list',
    component: QuestTypeListComponent,
    data: { title: 'Danh sách loại quest', url: 'quest-type' ,titleTab:'Danh sách loại quest' }
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestTypeListRoutingModule { }
