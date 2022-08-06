import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationEditComponent } from './location-edit.component';

const routes: Routes = [
  {
    path: '',
    component: LocationEditComponent,
    data: { title: 'Quay lại danh sách địa điểm', url: 'location' ,titleTab:'Cập nhật địa điểm' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationEditRoutingModule {}
