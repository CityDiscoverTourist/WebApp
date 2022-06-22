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
  totalCount: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Paging<T> {
  message: string;
  data: T[];
  pagination: PagingMetadata;
  status: string;
}

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
