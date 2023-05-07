import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBookHistory, NewBookHistory } from '../book-history.model';

export type PartialUpdateBookHistory = Partial<IBookHistory> & Pick<IBookHistory, 'id'>;

type RestOf<T extends IBookHistory | NewBookHistory> = Omit<T, 'issuedDate' | 'returnDate' | 'createdDate'> & {
  issuedDate?: string | null;
  returnDate?: string | null;
  createdDate?: string | null;
};

export type RestBookHistory = RestOf<IBookHistory>;

export type NewRestBookHistory = RestOf<NewBookHistory>;

export type PartialUpdateRestBookHistory = RestOf<PartialUpdateBookHistory>;

export type EntityResponseType = HttpResponse<IBookHistory>;
export type EntityArrayResponseType = HttpResponse<IBookHistory[]>;

@Injectable({ providedIn: 'root' })
export class BookHistoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/book-histories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bookHistory: NewBookHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bookHistory);
    return this.http
      .post<RestBookHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(bookHistory: IBookHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bookHistory);
    return this.http
      .put<RestBookHistory>(`${this.resourceUrl}/${this.getBookHistoryIdentifier(bookHistory)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(bookHistory: PartialUpdateBookHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bookHistory);
    return this.http
      .patch<RestBookHistory>(`${this.resourceUrl}/${this.getBookHistoryIdentifier(bookHistory)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestBookHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBookHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBookHistoryIdentifier(bookHistory: Pick<IBookHistory, 'id'>): number {
    return bookHistory.id;
  }

  compareBookHistory(o1: Pick<IBookHistory, 'id'> | null, o2: Pick<IBookHistory, 'id'> | null): boolean {
    return o1 && o2 ? this.getBookHistoryIdentifier(o1) === this.getBookHistoryIdentifier(o2) : o1 === o2;
  }

  addBookHistoryToCollectionIfMissing<Type extends Pick<IBookHistory, 'id'>>(
    bookHistoryCollection: Type[],
    ...bookHistoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bookHistories: Type[] = bookHistoriesToCheck.filter(isPresent);
    if (bookHistories.length > 0) {
      const bookHistoryCollectionIdentifiers = bookHistoryCollection.map(
        bookHistoryItem => this.getBookHistoryIdentifier(bookHistoryItem)!
      );
      const bookHistoriesToAdd = bookHistories.filter(bookHistoryItem => {
        const bookHistoryIdentifier = this.getBookHistoryIdentifier(bookHistoryItem);
        if (bookHistoryCollectionIdentifiers.includes(bookHistoryIdentifier)) {
          return false;
        }
        bookHistoryCollectionIdentifiers.push(bookHistoryIdentifier);
        return true;
      });
      return [...bookHistoriesToAdd, ...bookHistoryCollection];
    }
    return bookHistoryCollection;
  }

  protected convertDateFromClient<T extends IBookHistory | NewBookHistory | PartialUpdateBookHistory>(bookHistory: T): RestOf<T> {
    return {
      ...bookHistory,
      issuedDate: bookHistory.issuedDate?.format(DATE_FORMAT) ?? null,
      returnDate: bookHistory.returnDate?.format(DATE_FORMAT) ?? null,
      createdDate: bookHistory.createdDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restBookHistory: RestBookHistory): IBookHistory {
    return {
      ...restBookHistory,
      issuedDate: restBookHistory.issuedDate ? dayjs(restBookHistory.issuedDate) : undefined,
      returnDate: restBookHistory.returnDate ? dayjs(restBookHistory.returnDate) : undefined,
      createdDate: restBookHistory.createdDate ? dayjs(restBookHistory.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestBookHistory>): HttpResponse<IBookHistory> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestBookHistory[]>): HttpResponse<IBookHistory[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
