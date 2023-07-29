import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CardGridComponent } from './components/card-grid/card-grid.component';
import { CardComponent } from './components/card-grid/card/card.component';
import { TableComponent } from './components/table/table.component';
import { FiltersComponent } from './components/filters/filters.component';
import {
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@NgModule({
  declarations: [
    CardGridComponent,
    CardComponent,
    TableComponent,
    FiltersComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CardGridComponent, CardComponent, TableComponent, FiltersComponent],
  providers: [DatePipe, FormGroupDirective],
})
export class SharedModule {}
