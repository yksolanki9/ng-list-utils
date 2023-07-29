import { Injectable } from '@angular/core';
import { CardDetails } from '../models/card-details.model';
import { PaginationConfig } from '../models/pagination-config.model';

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
    config: Partial<PaginationConfig>
  ): CardDetails[] {
    const pageSize = config.pageSize || 6;
    if (config.pageNumber) {
      const start = (config.pageNumber - 1) * pageSize;
      const end = start + pageSize;
      return data.slice(start, end);
    }

    return data.slice(0, pageSize);
  }
}
