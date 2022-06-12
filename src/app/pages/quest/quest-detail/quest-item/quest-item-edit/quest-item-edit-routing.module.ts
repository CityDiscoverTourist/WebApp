import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestItemEditComponent } from './quest-item-edit.component';

const routes: Routes = [
  {
    path: '',
    component: QuestItemEditComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestItemEditRoutingModule { }
