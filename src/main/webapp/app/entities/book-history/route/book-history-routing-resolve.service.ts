import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBookHistory } from '../book-history.model';
import { BookHistoryService } from '../service/book-history.service';

@Injectable({ providedIn: 'root' })
export class BookHistoryRoutingResolveService implements Resolve<IBookHistory | null> {
  constructor(protected service: BookHistoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBookHistory | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bookHistory: HttpResponse<IBookHistory>) => {
          if (bookHistory.body) {
            return of(bookHistory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
