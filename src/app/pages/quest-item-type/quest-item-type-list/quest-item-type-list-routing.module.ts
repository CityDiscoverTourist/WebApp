import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestItemTypeListComponent } from './quest-item-type-list.component';

const routes: Routes = [
  {
    path: '',
    component: QuestItemTypeListComponent,
    data: { title: 'Danh sách loại câu hỏi', url: 'quest-item-type' },
  },
  {
    path: 'list',
    component: QuestItemTypeListComponent,
    data: { title: 'Danh sách loại câu hỏi', url: 'quest-item-type' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestItemTypeListRoutingModule {}
