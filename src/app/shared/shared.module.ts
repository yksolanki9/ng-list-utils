import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardGridComponent } from './components/card-grid/card-grid.component';
import { CardComponent } from './components/card-grid/card/card.component';

@NgModule({
  declarations: [ CardGridComponent, CardComponent],
  imports: [
    CommonModule
  ],
  exports: [ CardGridComponent, CardComponent ]
})
export class SharedModule { }
