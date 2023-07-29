import { Component } from '@angular/core';
import { DataService } from './core/services/data.service';
import { CardDetails } from './core/models/card-details.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { FiltersWithPageConfig } from './core/models/filters-with-page-config.model';
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

  filtersWithPageConfig$ = new BehaviorSubject<Partial<FiltersWithPageConfig>>(
    null
  );

  filteredData$: Observable<CardDetails[]>;

  paginatedData$: Observable<CardDetails[]>;

  unsubscribeSubject$ = new Subject<void>();

  DEFAULT_PAGE_SIZE = 6;

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

  private setupFormAndSubscription() {
    this.filtersWithPageForm = new FormGroup<FiltersWithPageForm>({
      search: new FormControl<string>(null),
      sort: new FormControl<string>(null),
      pageSize: new FormControl<number>(this.DEFAULT_PAGE_SIZE, [
        Validators.required,
        Validators.min(1),
      ]),
      pageNumber: new FormControl<number>(null, Validators.required),
    });

    //Changes in form values should update the query params in URL
    this.filtersWithPageForm.valueChanges
      .pipe(takeUntil(this.unsubscribeSubject$), debounceTime(300))
      .subscribe((filters) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: filters,
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      });
  }

  private setFilteredData() {
    //Filter out the changes in search and sort inputs
    const searchAndSortFilters$ = this.filtersWithPageConfig$.pipe(
      distinctUntilChanged(
        (prev, curr) => prev.search === curr.search && prev.sort === curr.sort
      )
    );

    //Update filteredData when the searchAndSortFilters$ emits a new value
    this.filteredData$ = combineLatest({
      data: this.getData(),
      filters: searchAndSortFilters$,
    }).pipe(
      map(({ data, filters }) => this.filterData(data, filters)),
      map((filteredData) => this.dateService.formatDate(filteredData)),
      shareReplay(1)
    );
  }

  private setPageNumberValidator(numEntries: number, pageSize: number) {
    const numPages = Math.ceil(numEntries / pageSize);
    this.filtersWithPageForm.controls.pageNumber.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(numPages),
    ]);
    this.filtersWithPageForm.controls.pageNumber.updateValueAndValidity();
  }

  private setPaginatedData() {
    //Filter out the changes in pagination inputs
    const paginationConfig$ = this.filtersWithPageConfig$.pipe(
      distinctUntilChanged(
        (prev, curr) =>
          prev.pageSize === curr.pageSize && prev.pageNumber === curr.pageNumber
      )
    );

    //Update paginatedData when filteredData changes or paginationConfig$ emits a new value
    this.paginatedData$ = combineLatest({
      data: this.filteredData$,
      config: paginationConfig$,
    }).pipe(
      tap(({ data, config }) =>
        this.setPageNumberValidator(data.length, config.pageSize)
      ),
      map(({ data, config }) =>
        this.filterService.paginate(data, config.pageSize, config.pageNumber)
      )
    );
  }

  ngOnInit() {
    this.setupFormAndSubscription();

    //Changes in query params should trigger the BehaviourSubject
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribeSubject$))
      .subscribe((queryParams) => {
        const filtersWithPageConfig = {
          ...queryParams,
          pageSize:
            (queryParams['pageSize'] && parseInt(queryParams['pageSize'])) ||
            this.DEFAULT_PAGE_SIZE,
          pageNumber:
            (queryParams['pageNumber'] &&
              parseInt(queryParams['pageNumber'])) ||
            1,
        };

        this.filtersWithPageConfig$.next(filtersWithPageConfig);

        //Set the query param values in the form only if the form is pristine
        if (this.filtersWithPageForm.pristine) {
          this.filtersWithPageForm.patchValue(filtersWithPageConfig);
        }
      });

    this.tableHeaders = this.dataService.getTableHeaders();
    this.setFilteredData();
    this.setPaginatedData();
  }

  ngOnDestroy() {
    this.unsubscribeSubject$.next();
    this.unsubscribeSubject$.complete();
  }
}
