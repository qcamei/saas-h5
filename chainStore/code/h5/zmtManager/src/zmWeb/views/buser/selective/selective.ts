import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {selectiveComponent} from "./selectiveComponent";


@Component({
  selector: 'page-buser-selective',
  template: `<div class="c-selective">
                      <div class="c-selective-body">
                          <div class=" text-center">
                            <h3 class="mg-b-40 font-bold" style="margin-top:80px; font-size: 30px;color: #333333">第一步　　选择角色</h3>
                            <p class="font-c4 mg-b-10 fz-14">选择你的身份(点击图片选择)</p>
                            <p class="font-c3 mg-b-10 fz-14">注意&nbsp;:&nbsp;确定之后不可更改</p>
                          </div>
                              <ul>
                                <li  (click)="adminModal()" class="mg-b-20"><img src="assets/images/admin.png" /> <p class="mg-t-40">管理端</p></li>
                                <li  (click)="workModal()"><img src="assets/images/work.png" /><p class="mg-t-40">工作端</p></li>
                              </ul>
                          </div>
                </div>
                `,
  styleUrls: ['./selective.scss'],
})

export class SelectivePage {
  constructor(private modalService: NgbModal) {
  }

  adminModal() {
    const activeModal = this.modalService.open(selectiveComponent);

    activeModal.componentInstance.modalHeader = '再次确认';
    activeModal.componentInstance.modalContent = '管理端：请确认是否选择管理端身份，选择完成之后身份将不能修改';
    activeModal.componentInstance.roleSet = 0;
  }

  workModal() {
    const activeModal = this.modalService.open(selectiveComponent);

    activeModal.componentInstance.modalHeader = '再次确认';
    activeModal.componentInstance.modalContent = '工作端：请确认是否选择工作端身份，选择完成之后身份将不能修改';
    activeModal.componentInstance.roleSet = 1;
  }

}

