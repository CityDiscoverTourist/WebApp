import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationComponent } from '../location.component';
import { LocationTypeComponent } from './location-type.component';
const routes: Routes = [
  {
    path: '',
    component: LocationTypeComponent,
  },
    {
  path: 'location-type',
    component: LocationTypeComponent,
  },
 
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationTypeRoutingModule { }
