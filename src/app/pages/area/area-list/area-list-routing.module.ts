import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaListComponent } from './area-list.component';

const routes: Routes = [
  {
    path: '',
    component: AreaListComponent,
    data: { title: 'Danh sách khu vực', url: 'area',titleTab:'Danh sách khu vực' }
  },
  {
    path: 'list',
    component: AreaListComponent,
    data: { title: 'Danh sách khu vực', url: 'area' ,titleTab:'Danh sách khu vực' }
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaListRoutingModule { }
