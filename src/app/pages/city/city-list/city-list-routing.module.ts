import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestListComponent } from '../../quest/quest-list/quest-list.component';
import { CityListComponent } from './city-list.component';

const routes: Routes = [
  {
    path: '',
    component: CityListComponent
  },
  {
    path: 'list',
    component: CityListComponent
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityListRoutingModule { }
