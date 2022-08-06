import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerQuestListComponent } from './customer-quest-list.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerQuestListComponent,
    data:{title:'Danh sách customer quest',url:'customer-quest',titleTab:'Danh sách customer quest'},
  },
  {
    path: 'list',
    component: CustomerQuestListComponent,
    data:{title:'Danh sách customer quest',url:'customer-quest',titleTab:'Danh sách customer quest'},
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerQuestListRoutingModule { }
