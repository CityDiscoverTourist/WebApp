import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerQuestDetailComponent } from './customer-quest-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerQuestDetailComponent,
  },
  {
    path: 'list',
    component: CustomerQuestDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerQuestDetailRoutingModule {}
