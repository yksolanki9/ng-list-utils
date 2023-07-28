import { Component } from '@angular/core';
import { DataService } from './core/services/data.service';
import { CardDetails } from './core/models/card-details.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dataSource: CardDetails[];

  tableHeaders: CardDetails;

  constructor(private dataService: DataService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.dataService.getData().subscribe((data) => {
      //Slice the data to only show 6 cards
      this.dataSource = data.slice(0, 6);
      this.dataSource = this.dataSource.map((row) => ({
        ...row,
        dateLastEdited: this.datePipe.transform(row.dateLastEdited, 'mediumDate')
      }));
      console.log('DATA SOURCE IS', this.dataSource);
    })
  }
}
