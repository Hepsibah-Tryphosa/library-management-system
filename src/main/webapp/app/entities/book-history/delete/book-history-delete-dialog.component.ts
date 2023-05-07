import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBookHistory } from '../book-history.model';
import { BookHistoryService } from '../service/book-history.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './book-history-delete-dialog.component.html',
})
export class BookHistoryDeleteDialogComponent {
  bookHistory?: IBookHistory;

  constructor(protected bookHistoryService: BookHistoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bookHistoryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
