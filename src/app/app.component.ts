import { Component } from '@angular/core';
import { DataService } from './core/services/data.service';
import { CardDetails } from './core/models/card-details.model';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, map, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Filters } from './core/models/filters.model';
import { DateService } from './core/services/date.service';
import { PaginationConfig } from './core/models/pagination-config.model';

type FiltersForm = {
  search: FormControl<string>;
  sort: FormControl<string>;
};

type PaginationForm = {
  pageSize: FormControl<number>;
  pageNumber: FormControl<number>;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  dataSource: CardDetails[];

  tableHeaders: CardDetails;

  searchString: string;

  filterForm: FormGroup<FiltersForm>;

  paginationForm: FormGroup<PaginationForm>;

  filters$ = new BehaviorSubject<Partial<Filters>>({
    search: null,
    sort: null,
  });

  paginationConfig$ = new BehaviorSubject<Partial<PaginationConfig>>({
    pageSize: 6,
    pageNumber: 1,
  });

  filteredData$: Observable<CardDetails[]>;

  paginatedData$: Observable<CardDetails[]>;

  constructor(
    private dataService: DataService,
    private dateService: DateService
  ) {}

  getData(): Observable<CardDetails[]> {
    return this.dataService.getData().pipe(shareReplay(1));
  }

  filterData(data: CardDetails[], filters: Partial<Filters>): CardDetails[] {
    if (filters.search) {
      data = data.filter((row) => {
        const searchString = filters.search.toLowerCase();
        return (
          row.name.toLowerCase().includes(searchString) ||
          row.description.toLowerCase().includes(searchString)
        );
      });
    }

    if (filters.sort) {
      const [sortField, sortDirection] = filters.sort.split('-');
      if (sortDirection === 'asc') {
        data.sort((val1, val2) => (val1[sortField] > val2[sortField] ? 1 : -1));
      } else if (sortDirection === 'desc') {
        data.sort((val1, val2) => (val1[sortField] < val2[sortField] ? 1 : -1));
      }
    }

    return data;
  }

  paginateData(
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

  ngOnInit() {
    this.getData().subscribe((data) => (this.dataSource = data));

    this.filterForm = new FormGroup<FiltersForm>({
      search: new FormControl(),
      sort: new FormControl(),
    });

    this.paginationForm = new FormGroup<PaginationForm>({
      pageSize: new FormControl(6),
      pageNumber: new FormControl(1),
    });

    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe((val) => {
      this.filters$.next(val);
    });

    this.paginationForm.valueChanges.subscribe((val) => {
      this.paginationConfig$.next(val);
    });

    this.filteredData$ = combineLatest({
      data: this.getData(),
      filters: this.filters$,
    }).pipe(
      map(({ data, filters }) => this.filterData(data, filters)),
      map((filteredData) => this.dateService.formatDate(filteredData)),
      shareReplay(1)
    );

    this.paginatedData$ = combineLatest({
      data: this.filteredData$,
      config: this.paginationConfig$,
    }).pipe(map(({ data, config }) => this.paginateData(data, config)));
  }
}
