import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestEditComponent } from '../quest-edit/quest-edit.component';
import { QuestEditModule } from '../quest-edit/quest-edit.module';
import { QuestDetailComponent } from './quest-detail.component';

const routes: Routes = [
  {
    path: '',
    component: QuestDetailComponent,
  },
  // {
  //   path: 'edit',
  //   component: QuestEditComponent,
  // },
  // { path: './:id/edit', component: QuestEditComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestDetailRoutingModule {}
