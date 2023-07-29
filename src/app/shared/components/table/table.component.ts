import { Component, Input, SimpleChanges } from '@angular/core';
import { CardDetails } from 'src/app/core/models/card-details.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() dataSource: CardDetails[];

  @Input() tableHeaders: string[];

  dataArray: string[][];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSource']?.currentValue?.length) {
      this.dataArray = this.dataSource.map((row) => Object.values(row));
    }
  }
}
