import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestTypeComponent } from 'src/app/pages/quest-type/quest-type.component';

export const routes: Routes = [
  { path: 'dashboard',component: QuestTypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
