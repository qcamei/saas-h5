import {Component, Input, OnInit, Inject} from '@angular/core';
import {Arrearage} from "../../../bsModule/arrearage/data/Arrearage";
import {PaymentHistory} from "../../../bsModule/arrearage/data/PaymentHistory";
import {AppUtils} from "../../../comModule/AppUtils";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'pay_record_popup',
  template: `

    <div>
            <h2 mat-dialog-title>
               还款记录
            </h2>
            <mat-dialog-content fusePerfectScrollbar>
                 <div class="payment disFlex mg-b-20">
                    <div class="paymentHis"><p class="my-0">订单欠款总额</p><h4 class="my-0"><i class="fa fa-yen mg-r-5"></i>{{data.balanceTotal|number:'1.2-2'}}</h4></div>
                    <div class="paymentHis" style="margin: 0 24px"><p class="my-0">已还款</p><h4 class="my-0"><i class="fa fa-yen mg-r-5"></i>{{(data.balanceTotal - data.balanceDue)|number:'1.2-2'}}</h4></div>
                    <div class="paymentHis"><p class="my-0">当前欠款</p><h4 class="my-0"><i class="fa fa-yen mg-r-5"></i>{{data.balanceDue|number:'1.2-2'}}</h4></div>
                </div>
                <zm-table-detail >
                  <thead>
                    <th>时间</th>
                    <th>还款金额</th>
                  </thead>
                  <tbody style="text-align: center">
                    <tr class="c-tr" *ngFor="let item of data.paymentHistories">
                      <td >{{item.createdTime | times}}</td>
                      <td><i class="fa fa-yen mg-r-5"></i>{{getPayAmount(item)|number:'1.2-2'}}</td>
                    </tr>
                  </tbody>
                </zm-table-detail>
                <div *ngIf="data.paymentHistories.length == 0"
                     style="padding: 12px 0;text-align: center;border: 1px solid #e9ecef;border-top: none;"><p
                  class="font-c2 mg-b-0">暂无还款记录</p></div>
            
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="end">
                  <zm-btn-md  (click)="closeModal()" name="确定"></zm-btn-md>
            </mat-dialog-actions>
     </div>
      
      
      
    <!--<div animation-modal>-->
      <!--<div class="modal-header">-->
        <!--<span class="font-bold">还款记录</span>-->
        <!--<button class="close" aria-label="Close" (click)="closeModal()">-->
          <!--<span aria-hidden="true">&times;</span>-->
        <!--</button>-->
      <!--</div>-->
      <!--<div class="modal-body">-->
        <!--<div class="payment disFlex mg-t-5 mg-b-20">-->
          <!--<div class="paymentHis"><p>订单欠款总额</p><h4><i class="fa fa-yen mg-r-5"></i>{{data.balanceTotal|number:'1.2-2'}}</h4></div>-->
          <!--<div class="paymentHis" style="margin: 0 24px"><p>已还款</p><h4><i class="fa fa-yen mg-r-5"></i>{{(data.balanceTotal - data.balanceDue)|number:'1.2-2'}}</h4></div>-->
          <!--<div class="paymentHis"><p>当前欠款</p><h4><i class="fa fa-yen mg-r-5"></i>{{data.balanceDue|number:'1.2-2'}}</h4></div>-->
        <!--</div>-->
        <!--<zm-table>-->
          <!--<thead>-->
            <!--<th>时间</th>-->
            <!--<th>还款金额</th>-->
          <!--</thead>-->
          <!--<tbody>-->
            <!--<tr class="c-tr" *ngFor="let item of data.paymentHistories">-->
              <!--<td >{{item.createdTime | times}}</td>-->
              <!--<td><i class="fa fa-yen mg-r-5"></i>{{getPayAmount(item)|number:'1.2-2'}}</td>-->
            <!--</tr>-->
          <!--</tbody>-->
        <!--</zm-table>-->
        <!--&lt;!&ndash;<table class="table table-bordered text-center c-prdtype-table">&ndash;&gt;-->
          <!--&lt;!&ndash;<thead>&ndash;&gt;-->
          <!--&lt;!&ndash;<th>时间</th>&ndash;&gt;-->
          <!--&lt;!&ndash;<th>还款金额</th>&ndash;&gt;-->
          <!--&lt;!&ndash;</thead>&ndash;&gt;-->
          <!--&lt;!&ndash;<tbody>&ndash;&gt;-->
          <!--&lt;!&ndash;<tr class="c-tr" *ngFor="let item of data.paymentHistories">&ndash;&gt;-->
            <!--&lt;!&ndash;<td >{{item.createdTime | times}}</td>&ndash;&gt;-->
            <!--&lt;!&ndash;<td><i class="fa fa-yen mg-r-5"></i>{{getPayAmount(item)|number:'1.2-2'}}</td>&ndash;&gt;-->
          <!--&lt;!&ndash;</tr>&ndash;&gt;-->
          <!--&lt;!&ndash;</tbody>&ndash;&gt;-->
        <!--&lt;!&ndash;</table>&ndash;&gt;-->
        <!--<div *ngIf="data.paymentHistories.length == 0"-->
             <!--style="padding: 12px 0;text-align: center;border: 1px solid #e9ecef;border-top: none;"><p-->
          <!--class="font-c2 mg-b-0">暂无还款记录</p></div>-->
      <!--</div>-->
      <!--<div class="modal-footer">-->
        <!--<button class="btn c-md-btn-modal c-btn-blue cur-hand" (click)="closeModal()">确认</button>-->
  <!---->
      <!--</div>-->
    <!--</div>-->
  `,
  styleUrls: ["modal.scss"]
})
export class PayRecordPopup implements OnInit {

  @Input() data:Arrearage;

  private activeModal: any;
  constructor( @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit(): void {
    if(this.data){
      this.data.paymentHistories.sort((a:PaymentHistory,b:PaymentHistory)=>{
        return b.createdTime - a.createdTime;
      })
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  /**
   * 计算还款金额
   * @param itemP
   * @returns {number}
   */
  getPayAmount(itemP:PaymentHistory){
    let costArr = itemP.payItems.map((item)=>{
      return item.cost;
    });
    let reduce = costArr.reduce((previousValue, currentValue)=>{
      return parseFloat(previousValue.toString()) + parseFloat(currentValue.toString());
    },0);
    return AppUtils.roundPoint(reduce,2);
  }

}
