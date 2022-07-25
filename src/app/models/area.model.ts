import { SearchInfo } from "./common.model";
import { Location } from "./location.model";

export interface AreaListItem {
  index:number;
  id:number;
  name: string;
  status: string;
  cityId: string;
  locations:Location[]
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

export interface AreaCreate{
  id:number;
  name:string;
  status:string;
  cityId:number;
}