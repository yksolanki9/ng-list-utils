import { Component, Input } from '@angular/core';
import { CardDetails } from 'src/app/core/models/card-details.model';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss']
})
export class CardGridComponent {
  @Input() dataSource: CardDetails[];
}
