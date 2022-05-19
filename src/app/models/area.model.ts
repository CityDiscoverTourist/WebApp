import { SearchInfo } from "./common.model";

export interface AreaListItem {
  id:number;
  name: string;
  status: string;
  // cityId: number;
}


export interface Area{
  id:number;
  name: string;
  status: string;
  cityId: number;
}

export interface AreaListSearch extends SearchInfo{
  cityIds?:number[]
}