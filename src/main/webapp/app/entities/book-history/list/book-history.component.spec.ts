import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BookHistoryService } from '../service/book-history.service';

import { BookHistoryComponent } from './book-history.component';

describe('BookHistory Management Component', () => {
  let comp: BookHistoryComponent;
  let fixture: ComponentFixture<BookHistoryComponent>;
  let service: BookHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'book-history', component: BookHistoryComponent }]), HttpClientTestingModule],
      declarations: [BookHistoryComponent],
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
      .overrideTemplate(BookHistoryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BookHistoryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BookHistoryService);

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
    expect(comp.bookHistories?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to bookHistoryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBookHistoryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBookHistoryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
