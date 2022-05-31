import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestEditComponent } from './quest-edit.component';

const routes: Routes = [
  {
    path: '',
    component: QuestEditComponent,
  },
  {
    path: 'edit',
    component: QuestEditComponent,
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestEditRoutingModule { }
