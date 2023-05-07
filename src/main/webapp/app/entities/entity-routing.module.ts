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
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
