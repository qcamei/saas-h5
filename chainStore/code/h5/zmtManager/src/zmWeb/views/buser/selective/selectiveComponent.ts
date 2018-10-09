import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AppRouter} from "../../../comModule/AppRouter";

@Component({
  selector: 'selective-modal',
  template: `
    <div class="modal-header">
      <span class="font-bold">{{ modalHeader }}</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <span>{{ modalContent }}</span>
    </div>
    <div class="modal-footer">
    <button class="btn c-md-btn-modal c-close-btn-modal" style="margin-right: 20px;"  (click)="closeModal()">取消</button>
    <button class="btn c-md-btn-modal c-btn-blue" (click)="setRole(roleSet)" >确认</button>
      
    </div>
  `,
})
export class selectiveComponent {

  modalHeader: string;
  modalContent: string;
  roleSet: number;

  constructor(private activeModal: NgbActiveModal) {
  }

  closeModal() {
    this.activeModal.close();
  }

  setRole(roleSet) {
    this.closeModal();
    AppRouter.goReg(roleSet);
  }
}
