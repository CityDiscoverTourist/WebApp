import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationEditComponent } from './location-edit.component';

const routes: Routes = [
  {
    path: '',
    component: LocationEditComponent,
  },
  {
    path: 'edit',
    component: LocationEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationEditRoutingModule {}
