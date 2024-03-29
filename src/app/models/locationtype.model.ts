import { SearchInfo } from "./common.model";
import { Location } from "./location.model";

export interface LocationType {
  id: number;
  name: string;
  status: string;
}

export interface LocationTypeListItem {
  index: number;
  id: number;
  name: string;
  createdDate:Date;
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

