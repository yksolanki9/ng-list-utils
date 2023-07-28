import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CardGridComponent } from './components/card-grid/card-grid.component';
import { CardComponent } from './components/card-grid/card/card.component';
import { TableComponent } from './components/table/table.component';

@NgModule({
  declarations: [ CardGridComponent, CardComponent, TableComponent],
  imports: [
    CommonModule
  ],
  exports: [ CardGridComponent, CardComponent, TableComponent ],
  providers: [DatePipe]
})
export class SharedModule { }
