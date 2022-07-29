import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { PagingMetadata, Comment } from 'src/app/models';

export interface CommentListState {
  comments: Comment[];
  metadata: PagingMetadata;
  loading: boolean;
}
export const COMMENT_LIST_STATE = new InjectionToken<RxState<CommentListState>>(
  'COMMENT_LIST_STATE'
);

