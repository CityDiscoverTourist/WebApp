import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationTypeListComponent } from './location-type-list.component';

const routes: Routes = [
  {
    path: '',
    component: LocationTypeListComponent,
  },
  {
    path: 'list',
    component: LocationTypeListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationTypeListRoutingModule {}
