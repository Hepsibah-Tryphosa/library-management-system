import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BookHistoryFormService, BookHistoryFormGroup } from './book-history-form.service';
import { IBookHistory } from '../book-history.model';
import { BookHistoryService } from '../service/book-history.service';
import { BookState } from 'app/entities/enumerations/book-state.model';

@Component({
  selector: 'jhi-book-history-update',
  templateUrl: './book-history-update.component.html',
})
export class BookHistoryUpdateComponent implements OnInit {
  isSaving = false;
  bookHistory: IBookHistory | null = null;
  bookStateValues = Object.keys(BookState);

  editForm: BookHistoryFormGroup = this.bookHistoryFormService.createBookHistoryFormGroup();

  constructor(
    protected bookHistoryService: BookHistoryService,
    protected bookHistoryFormService: BookHistoryFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookHistory }) => {
      this.bookHistory = bookHistory;
      if (bookHistory) {
        this.updateForm(bookHistory);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bookHistory = this.bookHistoryFormService.getBookHistory(this.editForm);
    if (bookHistory.id !== null) {
      this.subscribeToSaveResponse(this.bookHistoryService.update(bookHistory));
    } else {
      this.subscribeToSaveResponse(this.bookHistoryService.create(bookHistory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBookHistory>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bookHistory: IBookHistory): void {
    this.bookHistory = bookHistory;
    this.bookHistoryFormService.resetForm(this.editForm, bookHistory);
  }
}
