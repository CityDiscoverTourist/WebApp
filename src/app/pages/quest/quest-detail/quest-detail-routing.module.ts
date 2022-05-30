import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestDetailComponent } from './quest-detail.component';

const routes: Routes = [
  {
    path: '',
    component: QuestDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestDetailRoutingModule {}
