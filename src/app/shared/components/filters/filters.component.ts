import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  @Input() filtersWithPageForm: FormGroup;

  sortOptions: { name: string; value: string }[];

  constructor() {}

  ngOnInit() {
    this.sortOptions = [
      {
        name: 'None',
        value: null,
      },
      {
        name: 'Name (Ascending)',
        value: 'name-asc',
      },
      {
        name: 'Name (Descending)',
        value: 'name-desc',
      },
      {
        name: 'Date Last Edited (Ascending)',
        value: 'dateLastEdited-asc',
      },
      {
        name: 'Date Last Edited (Descending)',
        value: 'dateLastEdited-desc',
      },
    ];
  }
}
