import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BookHistoryComponent } from './list/book-history.component';
import { BookHistoryDetailComponent } from './detail/book-history-detail.component';
import { BookHistoryUpdateComponent } from './update/book-history-update.component';
import { BookHistoryDeleteDialogComponent } from './delete/book-history-delete-dialog.component';
import { BookHistoryRoutingModule } from './route/book-history-routing.module';

@NgModule({
  imports: [SharedModule, BookHistoryRoutingModule],
  declarations: [BookHistoryComponent, BookHistoryDetailComponent, BookHistoryUpdateComponent, BookHistoryDeleteDialogComponent],
})
export class BookHistoryModule {}
