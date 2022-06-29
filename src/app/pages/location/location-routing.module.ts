import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationComponent } from './location.component';

const routes: Routes = [
  {
    path: '',
    component: LocationComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./location-list/location-list.module').then(
            (m) => m.LocationListModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./location-list/location-list.module').then(
            (m) => m.LocationListModule
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./location-create/location-create.module').then(
            (m) => m.LocationCreateModule
          ),
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./location-edit/location-edit.module').then(
            (m) => m.LocationEditModule
          ),
      },
      {
        path: ':id/edit',
        loadChildren: () =>
          import('./location-edit/location-edit.module').then(
            (m) => m.LocationEditModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationRoutingModule {}
