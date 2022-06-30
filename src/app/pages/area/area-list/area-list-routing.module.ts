import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaListComponent } from './area-list.component';

const routes: Routes = [
  {
    path: '',
    component: AreaListComponent,
    data: { title: 'Danh sách khu vực', url: 'area' },
  },
  {
    path: 'list',
    component: AreaListComponent,
    data: { title: 'Danh sách khu vực', url: 'area' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaListRoutingModule { }
