import { Component } from '@angular/core';
import { DataService } from './core/services/data.service';
import { CardDetails } from './core/models/card-details.model';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dataSource: CardDetails[];

  tableHeaders: CardDetails;

  searchString: string;

  filterForm: FormGroup;

  constructor(private dataService: DataService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.dataService.getData().subscribe((data) => {
      this.dataSource = data.map((row) => ({
        ...row,
        dateLastEdited: this.datePipe.transform(row.dateLastEdited, 'mediumDate')
      }));
      console.log('DATA SOURCE IS', this.dataSource);
    })

    this.filterForm = new FormGroup({
      search: new FormControl(),
      sort: new FormControl(),
      page: new FormControl(),
    });

    this.filterForm.controls['search'].valueChanges.subscribe((val) => {
      console.log('search :', val);
    });

    this.filterForm.controls['sort'].valueChanges.subscribe((val) => {
      console.log('sort :', val);
    });

    this.filterForm.controls['page'].valueChanges.subscribe((val) => {
      console.log('page :', val);
    });
  }
}
