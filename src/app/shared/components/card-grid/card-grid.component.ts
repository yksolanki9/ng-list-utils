import { Component } from '@angular/core';
import { CardDetails } from 'src/app/core/models/card-details.model';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss']
})
export class CardGridComponent {
  dataSource: CardDetails[];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getData().subscribe((data) => {
      //Slice the data to only show 6 cards
      this.dataSource = data.slice(0, 6);
    })
  }
}
