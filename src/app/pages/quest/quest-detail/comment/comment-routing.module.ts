import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommentComponent } from './comment.component';

const routes: Routes = [
  {
    path: '',
    component: CommentComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./commemt-list/commemt-list.module').then(
            (m) => m.CommemtListModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./commemt-list/commemt-list.module').then(
            (m) => m.CommemtListModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommentRoutingModule {}
