import {Component, Output, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {BUserUpdateIntegralData} from "../../../bsModule/buser/apiData/BUserUpdateIntegralData";


@Component({
  selector: 'ngx-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">编辑积分</h4>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body input-group  form-group c-input-group " style="vertical-align: middle; padding-top:1.725rem;padding-bottom:0;margin-bottom: 0">
        <label style="margin-bottom: 0;"><span class="font-c3"> *</span>分类名称</label>
       <input type="number" placeholder="请输入修改后的积分" maxlength="10" [ngClass]="{'form-valid-error':integral.invalid && (integral.touched)}" name="integral"  class="mg-l-10 form-control "  required #integral ="ngModel" [(ngModel)]="viewData.integral" >
    </div>
     <div style="height: 1.725rem;margin-left: 99px;line-height: 1.725rem;">
       <div class="font-c3 fz-12"  *ngIf="integral.invalid && (integral.touched)">
            <div *ngIf="integral.errors.required">
              积分不能为空
           </div>
       </div>
     
     </div>
    <div class="modal-footer">
     <button class="btn c-md-btn-modal c-close-btn-modal" (click)="closeModal()" style="margin-right: 20px;">取消</button>
      <button class="btn c-btn-blue c-md-btn-modal" [disabled]="integral.invalid" (click)="save()">保存</button>
    </div>
  `,
})
export class ModalComponent implements OnInit{

  @Input() buser:BUser;
  @Output() getIntegral:(updateIntegralData)=>BUserUpdateIntegralData;

  private service: ModalService;
  public viewData :ModalViewData;

  constructor(private activeModal: NgbActiveModal) {
    this.service = new ModalViewData();
  }

  ngOnInit() {
    this.viewData = new ModalViewData();
  }

  closeModal() {
    this.activeModal.close();
  }

  save(){
    let updateIntegralData:BUserUpdateIntegralData = new BUserUpdateIntegralData();
    updateIntegralData.openId = this.buser.openId;
    updateIntegralData.integral = this.viewData.integral;
    this.getIntegral(updateIntegralData);
    this.closeModal();
  }

}

export class ModalViewData {
  integral:number;
}


class ModalService {

  constructor() {
  }


}


