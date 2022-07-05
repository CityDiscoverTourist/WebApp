import { SearchInfo } from './common.model';
import { QuestItem } from './questitem.model';

export interface LocationListItem {
  id: number;
  name: string;
  description: string;
  longitude: string;
  latitude: string;
  address: string;
  status: string;
  areaId: number;
  locationTypeId: number;
  questItems?: QuestItem[];
}

export interface Location {
  id: number;
  name: string;
  description: string;
  longitude: string;
  latitude: string;
  address: string;
  status: string;
  areaId: number;
  locationTypeId: number;
}
export interface LocationCreate {
  id: number;
  name: string;
  description: string;
  longitude: string;
  latitude: string;
  address: string;
  status: string;
  areaId: number;
  locationTypeId: number;
}

export interface LocationListSearch extends SearchInfo {
  locationTypeIds?: number[];
  areaIds?: number[];
}

export interface LocationCreateResult {
  id: number;
}
