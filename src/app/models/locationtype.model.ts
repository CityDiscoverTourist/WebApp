export interface LocationType {
  id: number;
  name: string;
  status: string;
}

export interface LocationTypeCreate {
  id: number;
  name: string;
  status: string;
}

export interface LocationTypeListItem {
  index: number;
  id: number;
  name: string;
  status: string;
}
