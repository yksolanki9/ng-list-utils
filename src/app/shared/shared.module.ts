import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardGridComponent } from './components/card-grid/card-grid.component';

@NgModule({
  declarations: [ CardGridComponent],
  imports: [
    CommonModule
  ],
  exports: [ CardGridComponent ]
})
export class SharedModule { }
