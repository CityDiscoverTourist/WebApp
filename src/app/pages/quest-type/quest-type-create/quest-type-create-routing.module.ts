import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestTypeCreateComponent } from './quest-type-create.component';

const routes: Routes = [
  {
    path: '',
    component: QuestTypeCreateComponent,
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestTypeCreateRoutingModule { }
