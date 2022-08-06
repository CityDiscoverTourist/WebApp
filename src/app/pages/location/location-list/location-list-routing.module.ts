import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationListComponent } from './location-list.component';

const routes: Routes = [
  {
    path: '',
    component: LocationListComponent,
    data: { title: 'Danh sách địa điểm', url: 'location',titleTab:'Danh sách địa điểm' }
  },
  {
    path: 'list',
    component: LocationListComponent,
    data: { title: 'Danh sách địa điểm', url: 'location' ,titleTab:'Danh sách địa điểm' }
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationListRoutingModule { }
