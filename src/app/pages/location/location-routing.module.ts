import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationComponent } from './location.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: ProductListComponent,
  // },

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
        // component: ProductCreateComponent,
        loadChildren: () =>
        import('./location-list/location-list.module').then(
          (m) => m.LocationListModule
        ),
      },
      {
        path: 'location-type',
        // component: ProductCreateComponent,
        loadChildren: () =>
        import('./location-type/location-type.module').then(
          (m) => m.LocationTypeModule
        ),
      },
     
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
