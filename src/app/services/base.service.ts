import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  status = [
    {
      id: 1,
      value: 'Active',
    },
    {
      id: 2,
      value: 'Inactive',
    },
  ];

  constructor() {}
}
