import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityListComponent } from './city-list.component';

const routes: Routes = [
  {
    path: '',
    component: CityListComponent,
    data: { title: 'Danh sách thành phố', url: 'city',titleTab:'Danh sách thành phố' }
  },
  {
    path: 'list',
    component: CityListComponent,
    data: { title: 'Danh sách thành phố', url: 'city',titleTab:'Danh sách thành phố' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CityListRoutingModule {}
