import { SearchInfo } from './common.model';

export interface CustomerTask {
  id: number;
  currentPoint: number;
  status: string;
  createdDate: Date;
  questItemId: number;
  customerQuestId: number;
  countWrongAnswer: number;
  countSuggestion: number;
  isFinished: boolean;
}

export interface CustomerTaskListItem {
  id: number;
  currentPoint: number;
  status: string;
  createdDate: Date;
  questItemId: number;
  customerQuestId: number;
  countWrongAnswer: number;
  countSuggestion: number;
  isFinished: boolean;
}

export interface CustomerTaskListSearch extends SearchInfo {
  isFinished?: number[];
}
