import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityDetailComponent } from './city-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CityDetailComponent,
  },
  {
    path: 'detail',
    component: CityDetailComponent,
  },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityDetailRoutingModule { }
