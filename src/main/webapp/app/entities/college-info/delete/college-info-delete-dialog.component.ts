import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICollegeInfo } from '../college-info.model';
import { CollegeInfoService } from '../service/college-info.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './college-info-delete-dialog.component.html',
})
export class CollegeInfoDeleteDialogComponent {
  collegeInfo?: ICollegeInfo;

  constructor(protected collegeInfoService: CollegeInfoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.collegeInfoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
