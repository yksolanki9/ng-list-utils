import { Component } from '@angular/core';
import { DataService } from './core/services/data.service';
import { CardDetails } from './core/models/card-details.model';
import { FormControl, FormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
} from 'rxjs/operators';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Filters } from './core/models/filters.model';
import { DateService } from './core/services/date.service';

type FiltersForm = {
  search: FormControl<string>;
  sort: FormControl<string>;
  page: FormControl<number>;
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

  filters$ = new BehaviorSubject<Partial<Filters>>({
    search: null,
    sort: null,
    page: null,
  });

  filteredData$: Observable<CardDetails[]>;

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

  ngOnInit() {
    this.getData().subscribe((data) => (this.dataSource = data));

    this.filterForm = new FormGroup<FiltersForm>({
      search: new FormControl(),
      sort: new FormControl(),
      page: new FormControl(),
    });

    this.filterForm.valueChanges.subscribe((val) => {
      this.filters$.next(val);
    });

    const searchAndSortFilters$ = this.filters$.pipe(
      debounceTime(300),
      distinctUntilChanged(
        (prev, curr) => prev.search === curr.search && prev.sort === curr.sort
      )
    );

    this.filteredData$ = combineLatest({
      data: this.getData(),
      filters: searchAndSortFilters$,
    }).pipe(
      map(({ data, filters }) => this.filterData(data, filters)),
      map((filteredData) => this.dateService.formatDate(filteredData)),
      shareReplay(1)
    );
  }
}
