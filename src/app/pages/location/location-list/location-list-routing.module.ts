import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationListComponent } from './location-list.component';

const routes: Routes = [
  {
    path: '',
    component: LocationListComponent,
    data: { title: 'Danh sách địa điểm', url: 'location' },
  },
  {
    path: 'list',
    component: LocationListComponent,
    data: { title: 'Danh sách địa điểm', url: 'location' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationListRoutingModule { }
