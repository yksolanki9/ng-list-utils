import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardDetails } from '../models/card-details.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getData(): Observable<CardDetails[]> {
    return this.http.get<CardDetails[]>('assets/data/data.json');
  }

  getTableHeaders(): string[] {
    return ['Name', 'Image URL', 'Description', 'Date Last Edited'];
  }
}
