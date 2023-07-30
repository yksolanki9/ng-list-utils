import { TestBed } from '@angular/core/testing';

import { FilterService } from './filter.service';
import {
  cardDetails1,
  cardDetails2,
  cardDetailsSortedByDate,
  cardDetailsSortedByName,
} from '../test-data/card-details.data';

//Should run tests only for this service when using `ng test`
fdescribe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('search(): ', () => {
    it('should return the correct result for exact match', () => {
      const searchQuery = '"the king"';
      const result = service.search(cardDetails1, searchQuery);
      expect(result).toEqual([cardDetails1[0], cardDetails1[3]]);
    });

    it('should return empty array for exact match when searchstring is not found', () => {
      const searchQuery = '"the kin"';
      const result = service.search(cardDetails1, searchQuery);
      expect(result).toEqual([]);
    });

    it('should return the correct result for non-exact match', () => {
      const searchQuery = 'the king';
      const result = service.search(cardDetails1, searchQuery);
      expect(result).toEqual(cardDetails1.slice(0, 4));
    });

    it('should return all entries for empty search string', () => {
      const searchQuery = '""';
      const result = service.search(cardDetails1, searchQuery);
      expect(result).toEqual(cardDetails1);
    });

    it('should return empty array if no match found in name and description', () => {
      const searchQuery = 'picsum';
      const result = service.search(cardDetails1, searchQuery);
      expect(result).toEqual([]);
    });
  });

  describe('sort(): ', () => {
    it('should correctly sort by name in ascending order', () => {
      const sortString = 'name-asc';
      const result = service.sort(cardDetails2, sortString);
      expect(result).toEqual(cardDetailsSortedByName);
    });

    it('should correctly sort by name in descending order', () => {
      const sortString = 'name-desc';
      const result = service.sort(cardDetails2, sortString);
      const cardDetailsCopy = [...cardDetailsSortedByName];
      expect(result).toEqual(cardDetailsCopy.reverse());
    });

    it('should correctly sort by dateLastEdited in ascending order', () => {
      const sortString = 'dateLastEdited-asc';
      const result = service.sort(cardDetails2, sortString);
      expect(result).toEqual(cardDetailsSortedByDate);
    });

    it('should correctly sort by dateLastEdited in descending order', () => {
      const sortString = 'dateLastEdited-desc';
      const result = service.sort(cardDetails2, sortString);
      const cardDetailsCopy = [...cardDetailsSortedByDate];
      expect(result).toEqual(cardDetailsCopy.reverse());
    });
  });

  describe('paginate(): ', () => {
    it('should return the correct result based on page size for first page', () => {
      const result = service.paginate(cardDetails1, 3, 1);
      expect(result).toEqual(cardDetails1.slice(0, 3));
    });

    it('should return the correct result based on page size and number', () => {
      const result = service.paginate(cardDetails1, 2, 3);
      expect(result).toEqual(cardDetails1.slice(4, 6));
    });

    it('should return the correct result based on page size if pageNumber is null', () => {
      const result = service.paginate(cardDetails1, 6, null);
      expect(result).toEqual(cardDetails1.slice(0, 6));
    });
  });
});
