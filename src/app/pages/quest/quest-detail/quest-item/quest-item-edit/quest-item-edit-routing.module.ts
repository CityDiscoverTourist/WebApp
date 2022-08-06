import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestItemEditComponent } from './quest-item-edit.component';

const routes: Routes = [
  {
    path: '',
    component: QuestItemEditComponent,
    data: {
      title: 'Quay lại chi tiết quest',
      url: `./quest/${localStorage.getItem(`questId`)}`,
      titleTab: 'Cập nhật câu hỏi',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestItemEditRoutingModule {}
