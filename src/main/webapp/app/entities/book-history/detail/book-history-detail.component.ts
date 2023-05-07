import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBookHistory } from '../book-history.model';

@Component({
  selector: 'jhi-book-history-detail',
  templateUrl: './book-history-detail.component.html',
})
export class BookHistoryDetailComponent implements OnInit {
  bookHistory: IBookHistory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookHistory }) => {
      this.bookHistory = bookHistory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
