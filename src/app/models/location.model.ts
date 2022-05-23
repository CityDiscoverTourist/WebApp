import { SearchInfo } from "./common.model";

export interface LocationListItem{
    id:string;
    name:string;
    description:string;
    longitude:string;
    latitude:string;
    address:string;
    status:string;
    areaId:number;
    locationTypeId:number;
    // createdAt:Date;
}

export interface Location{
    id:string;
    name:string;
    description:string;
    longitude:string;
    latitude:string;
    address:string;
    status:string;
    areaId:number;
    locationTypeId:number;
    // createdAt:Date;
}

export interface LocationListSearch extends SearchInfo{
    locationtypeIds?:number[]
}