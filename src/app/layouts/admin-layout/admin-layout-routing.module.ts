import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { QuestTypeComponent } from 'src/app/pages/quest-type/quest-type.component';

export const routes: Routes = [
  { path: 'dashboard',component: DashboardComponent },
  { path: 'quest-type',component: QuestTypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
