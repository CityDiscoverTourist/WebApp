import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityComponent } from './city.component';

const routes: Routes = [
 
  {
    path: '',
    component: CityComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./city-list/city-list.module').then(
            (m) => m.CityListModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
        import('./city-list/city-list.module').then(
          (m) => m.CityListModule
        ),
      },
      {
        path: 'detail',
        loadChildren: () =>
        import('./city-detail/city-detail.module').then(
          (m) => m.CityDetailModule
        ),
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule { }
