import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  status = [
    {
      id: 'Hoạt động',
      value: 'Active',
    },
    {
      id: 'Ngừng hoạt động',
      value: 'Inactive',
    },
  ];

  constructor() {}
}
