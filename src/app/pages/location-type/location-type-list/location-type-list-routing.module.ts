import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationTypeListComponent } from './location-type-list.component';

const routes: Routes = [
  {
    path: '',
    component: LocationTypeListComponent,
    data: { title: 'Danh sách loại địa điểm', url: 'location-type' ,titleTab:'Danh sách loại địa điểm' }
  },
  {
    path: 'list',
    component: LocationTypeListComponent,
    data: { title: 'Danh sách loại địa điểm', url: 'location-type' ,titleTab:'Danh sách loại địa điểm' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationTypeListRoutingModule {}
