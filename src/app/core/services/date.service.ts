import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { CardDetails } from '../models/card-details.model';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor(private datePipe: DatePipe) {}

  formatDate(data: CardDetails[]) {
    return data.map((row) => ({
      ...row,
      dateLastEdited: this.datePipe.transform(row.dateLastEdited, 'mediumDate'),
    }));
  }
}
