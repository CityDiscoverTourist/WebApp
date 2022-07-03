import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestEditComponent } from '../quest-edit/quest-edit.component';
import { QuestCreateComponent } from './quest-create.component';

const routes: Routes = [
  {
    path: '',
    component: QuestCreateComponent,
    data: { title: 'Quay lại danh sách quest', url: 'quest' },
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestCreateRoutingModule { }
