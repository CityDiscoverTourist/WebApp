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
  isFinishes = [
    {
      id: 'Đã kết thúc',
      value: true,
    },
    {
      id: 'Đang hoạt động',
      value: false,
    },
  ];

  constructor() {}
}
