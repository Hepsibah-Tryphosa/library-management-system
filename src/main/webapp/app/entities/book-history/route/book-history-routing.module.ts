import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BookHistoryComponent } from '../list/book-history.component';
import { BookHistoryDetailComponent } from '../detail/book-history-detail.component';
import { BookHistoryUpdateComponent } from '../update/book-history-update.component';
import { BookHistoryRoutingResolveService } from './book-history-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const bookHistoryRoute: Routes = [
  {
    path: '',
    component: BookHistoryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BookHistoryDetailComponent,
    resolve: {
      bookHistory: BookHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BookHistoryUpdateComponent,
    resolve: {
      bookHistory: BookHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BookHistoryUpdateComponent,
    resolve: {
      bookHistory: BookHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bookHistoryRoute)],
  exports: [RouterModule],
})
export class BookHistoryRoutingModule {}
