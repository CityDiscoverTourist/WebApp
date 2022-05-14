import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestTypeDetailComponent } from '../quest-type-detail/quest-type-detail.component';
import { QuestTypeCreateComponent } from './quest-type-create.component';

const routes: Routes = [
  {
    path: '',
    component: QuestTypeDetailComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestTypeCreateRoutingModule { }
