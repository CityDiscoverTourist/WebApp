import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  status = [
    {
      id: 1,
      name: 'Active',
    },
    {
      id: 2,
      name: 'InActive',
    },
    {
      id: 3,
      name: 'Deleted',
    },
  ];

  constructor() {}
}
