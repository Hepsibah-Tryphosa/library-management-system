import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CollegeInfoFormService, CollegeInfoFormGroup } from './college-info-form.service';
import { ICollegeInfo } from '../college-info.model';
import { CollegeInfoService } from '../service/college-info.service';

@Component({
  selector: 'jhi-college-info-update',
  templateUrl: './college-info-update.component.html',
})
export class CollegeInfoUpdateComponent implements OnInit {
  isSaving = false;
  collegeInfo: ICollegeInfo | null = null;

  editForm: CollegeInfoFormGroup = this.collegeInfoFormService.createCollegeInfoFormGroup();

  constructor(
    protected collegeInfoService: CollegeInfoService,
    protected collegeInfoFormService: CollegeInfoFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ collegeInfo }) => {
      this.collegeInfo = collegeInfo;
      if (collegeInfo) {
        this.updateForm(collegeInfo);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const collegeInfo = this.collegeInfoFormService.getCollegeInfo(this.editForm);
    if (collegeInfo.id !== null) {
      this.subscribeToSaveResponse(this.collegeInfoService.update(collegeInfo));
    } else {
      this.subscribeToSaveResponse(this.collegeInfoService.create(collegeInfo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICollegeInfo>>): void {
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

  protected updateForm(collegeInfo: ICollegeInfo): void {
    this.collegeInfo = collegeInfo;
    this.collegeInfoFormService.resetForm(this.editForm, collegeInfo);
  }
}
