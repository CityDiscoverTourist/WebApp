import { SearchInfo } from "./common.model";

export interface AreaListItem {
  index:number;
  id:number;
  name: string;
  status: string;
  // cityId: number;
  cityId: string;
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

export interface AreaData{
  id:number;
  name:string;
  status:string;
  cityId:number;
}