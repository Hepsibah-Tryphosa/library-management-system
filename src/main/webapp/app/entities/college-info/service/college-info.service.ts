import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICollegeInfo, NewCollegeInfo } from '../college-info.model';

export type PartialUpdateCollegeInfo = Partial<ICollegeInfo> & Pick<ICollegeInfo, 'id'>;

export type EntityResponseType = HttpResponse<ICollegeInfo>;
export type EntityArrayResponseType = HttpResponse<ICollegeInfo[]>;

@Injectable({ providedIn: 'root' })
export class CollegeInfoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/college-infos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(collegeInfo: NewCollegeInfo): Observable<EntityResponseType> {
    return this.http.post<ICollegeInfo>(this.resourceUrl, collegeInfo, { observe: 'response' });
  }

  update(collegeInfo: ICollegeInfo): Observable<EntityResponseType> {
    return this.http.put<ICollegeInfo>(`${this.resourceUrl}/${this.getCollegeInfoIdentifier(collegeInfo)}`, collegeInfo, {
      observe: 'response',
    });
  }

  partialUpdate(collegeInfo: PartialUpdateCollegeInfo): Observable<EntityResponseType> {
    return this.http.patch<ICollegeInfo>(`${this.resourceUrl}/${this.getCollegeInfoIdentifier(collegeInfo)}`, collegeInfo, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICollegeInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICollegeInfo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCollegeInfoIdentifier(collegeInfo: Pick<ICollegeInfo, 'id'>): number {
    return collegeInfo.id;
  }

  compareCollegeInfo(o1: Pick<ICollegeInfo, 'id'> | null, o2: Pick<ICollegeInfo, 'id'> | null): boolean {
    return o1 && o2 ? this.getCollegeInfoIdentifier(o1) === this.getCollegeInfoIdentifier(o2) : o1 === o2;
  }

  addCollegeInfoToCollectionIfMissing<Type extends Pick<ICollegeInfo, 'id'>>(
    collegeInfoCollection: Type[],
    ...collegeInfosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const collegeInfos: Type[] = collegeInfosToCheck.filter(isPresent);
    if (collegeInfos.length > 0) {
      const collegeInfoCollectionIdentifiers = collegeInfoCollection.map(
        collegeInfoItem => this.getCollegeInfoIdentifier(collegeInfoItem)!
      );
      const collegeInfosToAdd = collegeInfos.filter(collegeInfoItem => {
        const collegeInfoIdentifier = this.getCollegeInfoIdentifier(collegeInfoItem);
        if (collegeInfoCollectionIdentifiers.includes(collegeInfoIdentifier)) {
          return false;
        }
        collegeInfoCollectionIdentifiers.push(collegeInfoIdentifier);
        return true;
      });
      return [...collegeInfosToAdd, ...collegeInfoCollection];
    }
    return collegeInfoCollection;
  }
}
