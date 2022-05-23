import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaListComponent } from './area-list.component';

const routes: Routes = [
  {
    path: '',
    component: AreaListComponent,
  },
  {
    path: 'list',
    component: AreaListComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaListRoutingModule { }
