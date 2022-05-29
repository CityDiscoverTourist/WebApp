export interface Pagination<T> {
  message: string;
  data: T[];
  pagination: pagination[];
  status: string;
}

export class pagination {
  totalCount: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
