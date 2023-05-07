import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICollegeInfo } from '../college-info.model';
import { CollegeInfoService } from '../service/college-info.service';

@Injectable({ providedIn: 'root' })
export class CollegeInfoRoutingResolveService implements Resolve<ICollegeInfo | null> {
  constructor(protected service: CollegeInfoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICollegeInfo | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((collegeInfo: HttpResponse<ICollegeInfo>) => {
          if (collegeInfo.body) {
            return of(collegeInfo.body);
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
