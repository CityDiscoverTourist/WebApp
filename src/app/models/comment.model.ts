import { SearchInfo } from "./common.model";

export interface Comment {
  id: number;
  customerId: number;
  name: string;
  imagePath: string;
  feedBack: string;
  rating: number;
  createdDate: Date;
}


export interface CommentListSearch extends SearchInfo {
    status?: boolean;
  }
  