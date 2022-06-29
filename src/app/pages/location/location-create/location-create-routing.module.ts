import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationCreateComponent } from './location-create.component';

const routes: Routes = [
  {
    path: '',
    component: LocationCreateComponent,
    data: { title: 'Quay lại danh sách địa điểm', url: 'location' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationCreateRoutingModule {}
