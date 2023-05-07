import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CollegeInfoFormService } from './college-info-form.service';
import { CollegeInfoService } from '../service/college-info.service';
import { ICollegeInfo } from '../college-info.model';

import { CollegeInfoUpdateComponent } from './college-info-update.component';

describe('CollegeInfo Management Update Component', () => {
  let comp: CollegeInfoUpdateComponent;
  let fixture: ComponentFixture<CollegeInfoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let collegeInfoFormService: CollegeInfoFormService;
  let collegeInfoService: CollegeInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CollegeInfoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CollegeInfoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CollegeInfoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    collegeInfoFormService = TestBed.inject(CollegeInfoFormService);
    collegeInfoService = TestBed.inject(CollegeInfoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const collegeInfo: ICollegeInfo = { id: 456 };

      activatedRoute.data = of({ collegeInfo });
      comp.ngOnInit();

      expect(comp.collegeInfo).toEqual(collegeInfo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICollegeInfo>>();
      const collegeInfo = { id: 123 };
      jest.spyOn(collegeInfoFormService, 'getCollegeInfo').mockReturnValue(collegeInfo);
      jest.spyOn(collegeInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collegeInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: collegeInfo }));
      saveSubject.complete();

      // THEN
      expect(collegeInfoFormService.getCollegeInfo).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(collegeInfoService.update).toHaveBeenCalledWith(expect.objectContaining(collegeInfo));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICollegeInfo>>();
      const collegeInfo = { id: 123 };
      jest.spyOn(collegeInfoFormService, 'getCollegeInfo').mockReturnValue({ id: null });
      jest.spyOn(collegeInfoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collegeInfo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: collegeInfo }));
      saveSubject.complete();

      // THEN
      expect(collegeInfoFormService.getCollegeInfo).toHaveBeenCalled();
      expect(collegeInfoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICollegeInfo>>();
      const collegeInfo = { id: 123 };
      jest.spyOn(collegeInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collegeInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(collegeInfoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
