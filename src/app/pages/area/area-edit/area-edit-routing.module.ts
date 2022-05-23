import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaEditComponent } from './area-edit.component';

const routes: Routes = [
  {
    path: '',
    component: AreaEditComponent,
  },
  {
    path: 'edit',
    component: AreaEditComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaEditRoutingModule { }
