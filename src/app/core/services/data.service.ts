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
    const DATA_URL = 'assets/data/data.json';
    return this.http.get<CardDetails[]>(DATA_URL);
  }

  getTableHeaders(): string[] {
    return ['Name', 'Image URL', 'Description', 'Date Last Edited'];
  }
}
