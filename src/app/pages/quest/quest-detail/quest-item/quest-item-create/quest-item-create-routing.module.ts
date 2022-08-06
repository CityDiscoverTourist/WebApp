import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestItemCreateComponent } from './quest-item-create.component';

const routes: Routes = [
  {
    path: '',
    component: QuestItemCreateComponent,
    data: {
      title: 'Quay lại chi tiết quest',
      url: `./quest/${localStorage.getItem(`questId`)}`,
      titleTab: 'Thêm câu hỏi',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestItemCreateRoutingModule {}
