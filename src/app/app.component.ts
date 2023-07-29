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
import { FiltersWithPageConfig } from './core/models/filters.model';
import { DateService } from './core/services/date.service';
import { FilterService } from './core/services/filter.service';
import { ActivatedRoute, Router } from '@angular/router';

type FiltersWithPageForm = {
  search: FormControl<string>;
  sort: FormControl<string>;
  pageSize: FormControl<number>;
  pageNumber: FormControl<number>;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  tableHeaders: string[];

  filtersWithPageForm: FormGroup<FiltersWithPageForm>;

  filtersWithPageConfig$ = new BehaviorSubject<Partial<FiltersWithPageConfig>>({
    search: null,
    sort: null,
    pageSize: 6,
    pageNumber: 1,
  });

  filteredData$: Observable<CardDetails[]>;

  paginatedData$: Observable<CardDetails[]>;

  constructor(
    private dataService: DataService,
    private dateService: DateService,
    private filterService: FilterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  private getData(): Observable<CardDetails[]> {
    return this.dataService.getData().pipe(shareReplay(1));
  }

  private filterData(
    data: CardDetails[],
    filters: Partial<FiltersWithPageConfig>
  ): CardDetails[] {
    if (filters.search) {
      data = this.filterService.search(data, filters.search);
    }

    if (filters.sort) {
      data = this.filterService.sort(data, filters.sort);
    }

    return data;
  }

  ngOnInit() {
    this.tableHeaders = this.dataService.getTableHeaders();

    this.route.queryParams.subscribe((queryParams) => {
      this.filtersWithPageConfig$.next(queryParams);
    });

    this.filtersWithPageForm = new FormGroup<FiltersWithPageForm>({
      search: new FormControl(),
      sort: new FormControl(),
      pageSize: new FormControl(6),
      pageNumber: new FormControl(1),
    });

    this.filtersWithPageForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe((filters) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: filters,
          queryParamsHandling: 'merge',
        });
      });

    const searchAndSortFilters$ = this.filtersWithPageConfig$.pipe(
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

    const paginationConfig$ = this.filtersWithPageConfig$.pipe(
      distinctUntilChanged(
        (prev, curr) =>
          prev.pageSize === curr.pageSize && prev.pageNumber === curr.pageNumber
      )
    );

    this.paginatedData$ = combineLatest({
      data: this.filteredData$,
      config: paginationConfig$,
    }).pipe(
      map(({ data, config }) =>
        this.filterService.paginate(data, config.pageSize, config.pageNumber)
      )
    );
  }
}
