import {Component, OnInit, Input, Output, Inject} from '@angular/core';

import {CancelReason} from "../../../../bsModule/appointment/data/CancelReason";
import {MAT_DIALOG_DATA} from "@angular/material";
import {SelectItem} from "../../../zmComp/form/ZmSelect";

@Component({
  selector: 'my-message',
  template: `
<div>
        <div class="popup-title disFlex text-center" mat-dialog-title>
          <span class="flex align-center">确定取消预约</span>
          <i class="nb-close pd-r-10 text-right" style="font-size:26px;cursor:pointer;"></i>
        </div>
        <mat-dialog-content fusePerfectScrollbar>
             <zm-select  [label]="'取消原因：'" [selectList] = "reasonsList" [noAll]="true" [(zmValue)]="reason" ></zm-select>
                <zm-input-textarea [label]="'备注'" [placeholder]="'请输入100字以内的备注信息'" [(text)]="remark" maxlength="100"></zm-input-textarea>
           <!--<div class="center_message">-->
              <!--<form class="form-inline">-->
                  <!--<div class="form-group">-->
                    <!--<label>取消原因：</label>-->
                    <!--<select name="sel" id="my_sel" [(ngModel)]="reason" (ngModelChange)="selectReason()">-->
                      <!--<option *ngFor="let item of reasonsList" [value]="item">{{item}}</option>-->
                    <!--</select>-->
                  <!--</div>-->
                  <!--<div>-->
                    <!--<p style="margin:15px 0 5px;text-align: left;">备注</p>-->
                    <!--<textarea name="text" style="width:310px;"rows="6" placeholder="请输入100字以内的备注信息" [(ngModel)]="remark" maxlength="100"></textarea>-->
                  <!--</div>-->
                <!--</form>-->
            <!--</div>-->
        
        </mat-dialog-content>
        <mat-dialog-actions>
          <div  fxLayout="row wrap" fxLayoutAlign="end" fxLayoutGap="20px" class="zmFullWidth">
              <div class="flex text-right pd-r-20">
                <button class="cancel-btn" (click)=closeModal()>取消</button>
              </div>
              <div class="flex text-left pd-l-20">
                 <button class="confirm-btn"(click)="confirmCancel()">确定</button>
              </div>
          </div>
        </mat-dialog-actions>
    </div>


<!--<div>-->
    <!--<div class="popup" animation-modal>-->
        <!--<div class="popup-title disFlex text-center">-->
          <!--<span class="flex align-center">确定取消预约</span>-->
          <!--<i class="nb-close pd-r-10 text-right" style="font-size:26px;cursor:pointer;"></i>-->
        <!--</div>-->
        <!--<div class="popup-content">-->
            <!--<div class="center_message">-->
                <!--<form class="form-inline">-->
                  <!--<div class="form-group">-->
                    <!--<label>取消原因：</label>-->
                    <!--<select name="sel" id="my_sel" [(ngModel)]="reason" (ngModelChange)="selectReason($event)">-->
                      <!--<option *ngFor="let item of reasonsList" [value]="item">{{item}}</option>-->
                    <!--</select>-->
                  <!--</div>-->
                  <!--<div>-->
                    <!--<p style="margin:15px 0 5px;text-align: left;">备注</p>-->
                    <!--<textarea name="text" style="width:310px;"rows="6" placeholder="请输入100字以内的备注信息" [(ngModel)]="remark" maxlength="100"></textarea>-->
                  <!--</div>-->
                <!--</form>-->
            <!--</div>-->
        <!--</div>-->
        <!--<div class="popup-btn-area disFlex">-->
          <!--<div class="flex text-right pd-r-20">-->
            <!--<button class="cancel-btn" (click)=closeModal()>取消</button>-->
          <!--</div>-->
          <!--<div class="flex text-left pd-l-20">-->
          <!--<button class="confirm-btn"(click)="confirmCancel()">确定</button></div>-->
          <!--</div>-->
      <!--</div>-->
    <!--<div class="mask"></div>-->
<!--</div>-->

`,
  styleUrls: ['cancelAppointmentComp.scss']
})
export class CancelAppointComp implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;

    this.action = dataInput.callBack ;
    this.reasonsList = new Array<SelectItem>()
    dataInput.modalData.reasonsList.forEach((itemTmp)=>{
      this.reasonsList.push(new SelectItem(itemTmp,itemTmp));
    });

  }

  activeModal: any;
  @Input() reasonsList:Array<SelectItem>;
  @Output() action:(cancelReason) => void;

  public reason:string;
  public remark:string;

  ngOnInit() {
  }


  closeModal(){
    this.activeModal.close();
  }

  confirmCancel() {
    let cancelReason:CancelReason = new CancelReason();
    cancelReason.reason = this.reason;
    cancelReason.remarks = this.remark;
    this.action(cancelReason);
    this.activeModal.close();
  }



}

