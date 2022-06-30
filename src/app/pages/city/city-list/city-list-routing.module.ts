import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityListComponent } from './city-list.component';

const routes: Routes = [
  {
    path: '',
    component: CityListComponent,
    data: { title: 'Danh sách thành phố', url: 'city' },
  },
  {
    path: 'list',
    component: CityListComponent,
    data: { title: 'Danh sách thành phố', url: 'city' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CityListRoutingModule {}
