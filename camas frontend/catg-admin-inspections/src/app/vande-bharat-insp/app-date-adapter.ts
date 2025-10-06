import { Injectable } from '@angular/core';
import { NativeDateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
  // Format display in input
  override format(date: Date, displayFormat: Object): string {
    const day = this._to2digit(date.getDate());
    const month = this._to2digit(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private _to2digit(n: number) {
    return n < 10 ? '0' + n : n;
  }
}

// Define parse and display formats
export const APP_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD-MM-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
