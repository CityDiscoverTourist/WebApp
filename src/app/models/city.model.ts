import { Area } from './area.model';
import { SearchInfo } from './common.model';

export interface City {
  id: number;
  name: string;
  status: string;
}

export interface CityCreate {
  id: number;
  name: string;
  status: string;
}
export interface CityListItem {
  index: number;
  id: number;
  name: string;
  createdDate:Date;
  status: string;
  areas:Area[]
}

export interface CityListSearch extends SearchInfo {
  status?: number[];
}

export interface CityCreateResult {
  id: number;
}
