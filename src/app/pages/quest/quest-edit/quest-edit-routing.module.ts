import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestEditComponent } from './quest-edit.component';

const routes: Routes = [
  {
    path: '',
    component: QuestEditComponent,
    data: { title: 'Quay lại danh sách quest', url: 'quest',titleTab:'Cập nhật quest' }
  },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestEditRoutingModule { }
