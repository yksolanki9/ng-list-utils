import { Injectable } from '@angular/core';
import { CardDetails } from '../models/card-details.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor() {}

  search(data: CardDetails[], searchString: string): CardDetails[] {
    const exactSearchRegex = new RegExp('^"(.*)"$');
    const exactSearchString = exactSearchRegex.exec(searchString);
    let searchRegex: RegExp;
    if (exactSearchString) {
      //Exact Match
      searchRegex = new RegExp(exactSearchString[1], 'i');
    } else {
      //Non exact match
      searchRegex = new RegExp(searchString.split(' ').join('.*'), 'i');
    }
    return data.filter((row) => {
      return searchRegex.test(row.name) || searchRegex.test(row.description);
    });
  }

  sort(data: CardDetails[], sortExp: string): CardDetails[] {
    const [sortField, sortDirection] = sortExp.split('-');
    const dataCopy = [...data];
    if (sortDirection === 'asc') {
      dataCopy.sort((val1, val2) =>
        val1[sortField] > val2[sortField] ? 1 : -1
      );
    } else if (sortDirection === 'desc') {
      dataCopy.sort((val1, val2) =>
        val1[sortField] < val2[sortField] ? 1 : -1
      );
    }
    return dataCopy;
  }

  paginate(
    data: CardDetails[],
    pageSize: number,
    pageNumber: number
  ): CardDetails[] {
    const PAGE_SIZE = pageSize || 6;
    if (pageNumber) {
      const start = (pageNumber - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      return data.slice(start, end);
    }

    return data.slice(0, PAGE_SIZE);
  }
}
