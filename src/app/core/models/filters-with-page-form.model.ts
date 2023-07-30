import { FormControl } from '@angular/forms';

export interface FiltersWithPageForm {
  search: FormControl<string>;
  sort: FormControl<string>;
  pageSize: FormControl<number>;
  pageNumber: FormControl<number>;
}
