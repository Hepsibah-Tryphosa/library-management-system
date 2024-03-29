import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBook, NewBook } from '../book.model';
import { IBookSummary } from '../booksummary.model';

export type PartialUpdateBook = Partial<IBook> & Pick<IBook, 'id'>;

type RestOf<T extends IBook | NewBook> = Omit<T, 'issuedDate' | 'returnDate' | 'createdDate'> & {
  issuedDate?: string | null;
  returnDate?: string | null;
  createdDate?: string | null;
};

export type RestBook = RestOf<IBook>;

export type NewRestBook = RestOf<NewBook>;

export type PartialUpdateRestBook = RestOf<PartialUpdateBook>;

export type EntityResponseType = HttpResponse<IBook>;
export type EntityArrayResponseType = HttpResponse<IBook[]>;
export type EntityResponseTypeBookSummary = HttpResponse<IBookSummary>;
@Injectable({ providedIn: 'root' })
export class BookService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/books');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(book: NewBook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(book);
    return this.http.post<RestBook>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(book: IBook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(book);
    return this.http
      .put<RestBook>(`${this.resourceUrl}/${this.getBookIdentifier(book)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(book: PartialUpdateBook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(book);
    return this.http
      .patch<RestBook>(`${this.resourceUrl}/${this.getBookIdentifier(book)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestBook>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBook[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBookIdentifier(book: Pick<IBook, 'id'>): number {
    return book.id;
  }

  getBookSummary(name: string): Observable<EntityResponseTypeBookSummary> {
    return this.http.get<IBookSummary>(`${this.resourceUrl}/summary`, { observe: 'response' });
  }

  compareBook(o1: Pick<IBook, 'id'> | null, o2: Pick<IBook, 'id'> | null): boolean {
    return o1 && o2 ? this.getBookIdentifier(o1) === this.getBookIdentifier(o2) : o1 === o2;
  }

  addBookToCollectionIfMissing<Type extends Pick<IBook, 'id'>>(
    bookCollection: Type[],
    ...booksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const books: Type[] = booksToCheck.filter(isPresent);
    if (books.length > 0) {
      const bookCollectionIdentifiers = bookCollection.map(bookItem => this.getBookIdentifier(bookItem)!);
      const booksToAdd = books.filter(bookItem => {
        const bookIdentifier = this.getBookIdentifier(bookItem);
        if (bookCollectionIdentifiers.includes(bookIdentifier)) {
          return false;
        }
        bookCollectionIdentifiers.push(bookIdentifier);
        return true;
      });
      return [...booksToAdd, ...bookCollection];
    }
    return bookCollection;
  }

  protected convertDateFromClient<T extends IBook | NewBook | PartialUpdateBook>(book: T): RestOf<T> {
    return {
      ...book,
      issuedDate: book.issuedDate?.format(DATE_FORMAT) ?? null,
      returnDate: book.returnDate?.format(DATE_FORMAT) ?? null,
      createdDate: book.createdDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restBook: RestBook): IBook {
    return {
      ...restBook,
      issuedDate: restBook.issuedDate ? dayjs(restBook.issuedDate) : undefined,
      returnDate: restBook.returnDate ? dayjs(restBook.returnDate) : undefined,
      createdDate: restBook.createdDate ? dayjs(restBook.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestBook>): HttpResponse<IBook> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestBook[]>): HttpResponse<IBook[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
