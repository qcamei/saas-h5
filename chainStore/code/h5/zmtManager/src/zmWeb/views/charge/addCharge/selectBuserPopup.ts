import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {AppUtils} from "../../../comModule/AppUtils";

@Component({
  selector: 'select-buser-popup',
  template: `
    <div class="modal-header">
      <span class="font-bold">选择商户</span>
    </div>
    <div class="modal-body">
      <zm_search_box [label]="'商户查询'" [placeholder]="'手机号'" [(zmValue)]="queryParam" (callBack)="findBuser()"></zm_search_box>
     <div style="margin-top:20px;">
      <zm_table_detail>
        <thead>
          <th style="padding:5px 0 !important;">姓名</th>
          <th style="padding:5px 0 !important;">手机号</th>
        </thead>
        <tbody>
          <tr (click)="select()">
            <td style="padding:5px 0 !important;">{{buser?buser.name:"-"}}</td>
            <td style="padding:5px 0 !important;">{{buser?buser.phone:"-"}}</td>
        </tbody>
      </zm_table_detail>
      </div>
    </div>
    <div class="modal-footer">
      
    </div>
  `,
})
export class SelectBuserPopup {

  queryParam:string;
  buser:BUser;

  action:any;

  constructor(private buserMgr:BUserMgr,private activeModal: NgbActiveModal) {
  }

  closeModal() {
    this.activeModal.close();
  }

  findBuser(){
    if(!AppUtils.isNullObj(this.queryParam)){
      this.queryParam = AppUtils.isNullOrWhiteSpace(this.queryParam)?"":AppUtils.trimBlank(this.queryParam);
      this.buserMgr.findByPhone(this.queryParam).then((buser:BUser)=>{
        if(!AppUtils.isNullObj(buser)){
          this.buser = buser;
        }
      })
    }
  }

  /**
   * 选择商户
   */
  select(){
    this.action(this.buser);
    this.closeModal();
  }

}
