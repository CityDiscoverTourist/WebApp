import { SearchInfo } from "./common.model";

export interface LocationType {
  id: number;
  name: string;
  status: string;
}

export interface LocationTypeListItem {
  index: number;
  id: number;
  name: string;
  status: string;
  locations:Location[]
}

export interface LocationTypeListSearch extends SearchInfo{
  status?:number[]
}

export interface LocationTypeCreate {
  id: number;
  name: string;
  status: string;
}

