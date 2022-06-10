import { SearchInfo } from './common.model';

export interface LocationListItem {
  id: string;
  name: string;
  description: string;
  longitude: string;
  latitude: string;
  address: string;
  status: string;
  areaId: number;
  locationTypeId: number;
}

export interface Location {
  id: string;
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
  id: string;
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
  areaIds?:number[];
}

export interface LocationCreateResult {
  id: number;
}
