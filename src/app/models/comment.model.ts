import { SearchInfo } from "./common.model";

export interface Comment {
  id: number;
  customerId: number;
  name: string;
  imagePath: string;
  feedBack: string;
  rating: number;
  createdDate: Date;
  isFeedbackApproved:boolean;
}


export interface CommentListSearch extends SearchInfo {
  isFeedbackApproved?: boolean;
  }
  