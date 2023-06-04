import { Pipe, PipeTransform } from '@angular/core';
import { IBook } from 'app/entities/book/book.model';

@Pipe({ name: 'bookFilter' })
export class BookFilterPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform(items: IBook[], searchText: string): any[] {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    return items.filter(it => it.title!.toLocaleLowerCase().includes(searchText));
  }
}
