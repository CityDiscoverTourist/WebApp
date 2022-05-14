import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestTypeEditComponent } from './quest-type-edit.component';

const routes: Routes = [
  {
    path: '',
    component: QuestTypeEditComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestTypeEditRoutingModule { }
