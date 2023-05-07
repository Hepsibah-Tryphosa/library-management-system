import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CollegeInfoService } from '../service/college-info.service';

import { CollegeInfoComponent } from './college-info.component';

describe('CollegeInfo Management Component', () => {
  let comp: CollegeInfoComponent;
  let fixture: ComponentFixture<CollegeInfoComponent>;
  let service: CollegeInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'college-info', component: CollegeInfoComponent }]), HttpClientTestingModule],
      declarations: [CollegeInfoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(CollegeInfoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CollegeInfoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CollegeInfoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.collegeInfos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to collegeInfoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCollegeInfoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCollegeInfoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
