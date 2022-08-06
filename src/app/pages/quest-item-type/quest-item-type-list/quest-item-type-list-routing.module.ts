import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestItemTypeListComponent } from './quest-item-type-list.component';

const routes: Routes = [
  {
    path: '',
    component: QuestItemTypeListComponent,
    data: { title: 'Danh sách loại câu hỏi', url: 'quest-item-type', titleTab:'Danh sách loại câu hỏi' }
  },
  {
    path: 'list',
    component: QuestItemTypeListComponent,
    data: { title: 'Danh sách loại câu hỏi', url: 'quest-item-type', titleTab:'Danh sách loại câu hỏi' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestItemTypeListRoutingModule {}
