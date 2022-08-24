import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HourService {
  constructor() {}

  getHour() {
    var date = new Date();
    let hour = date.getHours();

    if (hour < 19 && hour > 7) {
      return true;
    }
    return false;
  }
}
