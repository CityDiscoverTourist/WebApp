import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationTypeComponent } from './location-type.component';

const routes: Routes = [
  {
    path: '',
    component: LocationTypeComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./location-type-list/location-type-list.module').then(
            (m) => m.LocationTypeListModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./location-type-list/location-type-list.module').then(
            (m) => m.LocationTypeListModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationTypeRoutingModule {}
