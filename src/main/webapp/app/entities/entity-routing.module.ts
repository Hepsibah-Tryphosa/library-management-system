import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'college-info',
        data: { pageTitle: 'libraryMangementApp.collegeInfo.home.title' },
        loadChildren: () => import('./college-info/college-info.module').then(m => m.CollegeInfoModule),
      },
      {
        path: 'course',
        data: { pageTitle: 'libraryMangementApp.course.home.title' },
        loadChildren: () => import('./course/course.module').then(m => m.CourseModule),
      },
      {
        path: 'student',
        data: { pageTitle: 'libraryMangementApp.student.home.title' },
        loadChildren: () => import('./student/student.module').then(m => m.StudentModule),
      },
      {
        path: 'book',
        data: { pageTitle: 'libraryMangementApp.book.home.title' },
        loadChildren: () => import('./book/book.module').then(m => m.BookModule),
      },
      {
        path: 'book-history',
        data: { pageTitle: 'libraryMangementApp.bookHistory.home.title' },
        loadChildren: () => import('./book-history/book-history.module').then(m => m.BookHistoryModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
