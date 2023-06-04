import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBook } from '../book.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, BookService } from '../service/book.service';
import { BookDeleteDialogComponent } from '../delete/book-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { BookState } from 'app/entities/enumerations/book-state.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IBookSummary } from '../booksummary.model';

@Component({
  selector: 'jhi-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  searchTerm = '';
  books?: IBook[];
  isLoading = false;
  userAccount: Account | null = null;
  loggedStudent: IStudent | null = null;
  predicate = 'bookState';
  ascending = false;
  bookSummary: IBookSummary | null = null;

  constructor(
    protected bookService: BookService,
    protected studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    private accountService: AccountService,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IBook): number => this.bookService.getBookIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.userAccount = account;
        if (this.accountService.hasAnyAuthority('ROLE_USER')) {
          this.studentService.findByName(account.login).subscribe(student => {
            if (student.body) {
              this.loggedStudent = student.body;
            }
          });
        }
      }
    });
  }

  requestBook(book: IBook): void {
    book.students = [];
    book.students.push(this.loggedStudent!);
    this.bookAction(book, BookState.REQUESTED);
  }

  issueBook(book: IBook): void {
    this.bookAction(book, BookState.ISSUED);
  }
  returnBook(book: IBook): void {
    this.bookAction(book, BookState.AVAILABLE);
  }

  bookAction(book: IBook, bookState: BookState): void {
    book.bookState = bookState;
    this.bookService.update(book).subscribe(() => {
      this.load();
    });
  }

  delete(book: IBook): void {
    const modalRef = this.modalService.open(BookDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.book = book;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });

    this.bookService.getBookSummary('').subscribe({
      next: (res: any) => {
        this.bookSummary = res.body;
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.books = this.refineData(dataFromBody);
  }

  protected refineData(data: IBook[]): IBook[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IBook[] | null): IBook[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.bookService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
