import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BookHistoryDetailComponent } from './book-history-detail.component';

describe('BookHistory Management Detail Component', () => {
  let comp: BookHistoryDetailComponent;
  let fixture: ComponentFixture<BookHistoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookHistoryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ bookHistory: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BookHistoryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BookHistoryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bookHistory on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.bookHistory).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
