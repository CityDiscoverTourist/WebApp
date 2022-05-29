// export interface PagingRequest<T> {
//     keyword?: string;
//     // sort?: { sortBy: string; dir: 'asc' | 'desc' };
//     sortBy?:string;
//     sortDir?:"asc"|"desc";
//     currentPage?: number;
//     query?:T;
//   }

//   export interface IdValue {
//     id: number;
//     value: string;
//   }

//   export interface PagingMetadata {
//     currentPage: number;
//     count: number;
//     itemPerPage: number;
//   }
//   // export interface Paging<T> {
//   //   records: T[];
//   //   metadata: PagingMetadata;
//   // }

//   export interface PagingResponse<T> {
//     records: T[];
//     metadata: PagingMetadata;
//   }

//   export interface Result<T>{
//     data?:T;
//     statusCode?:string;
//     isOk:boolean;
//   }

export interface SearchInfo {
  keyword?: string;
  sort?: { sortBy: string; dir: 'asc' | 'desc' };
  currentPage?: number;
}
export interface IdValue {
  id: number;
  value: string;
}

export interface PagingMetadata {
  currentPage: number;
  count: number;
  itemPerPage: number;
}

export interface Paging<T> {
  records: T[];
  metadata: PagingMetadata;
}
export interface PagingMetadataTest {
  totalCount: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PagingTest<T> {
  message: string;
  data: T[];
  pagination: PagingMetadataTest;
  status: string;
}

// export interface Result<T>{
//   data?:T;
//   statusCode?:string;
// }
export interface Result<T> {
  message?: string;
  data?: T;
  pagination?: pagination;
  status?: string;
}

export interface pagination {
  totalCount: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// export interface BaseError{
//   statusCode:string |null;
// }
