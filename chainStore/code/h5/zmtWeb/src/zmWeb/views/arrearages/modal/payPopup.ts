import {Component, Output, OnInit, OnDestroy, Input, Inject} from '@angular/core';
import {PayData} from "../../storeflow/wfComp/WFDataWraper";
import {ArrearagesDetailViewData} from "../arrearagesDetails/arrearagesDetails";
import {AppUtils} from "../../../comModule/AppUtils";
import {Arrearage} from "../../../bsModule/arrearage/data/Arrearage";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 还款模态框
 */
@Component({
  selector: 'pay_popup',
  template: `    
    
    <div>
            <h2 mat-dialog-title>
               还款
            </h2>
            <mat-dialog-content fusePerfectScrollbar>
                         <div fxLayout="row"  fxLayoutAlign="space-between center"  style="margin-bottom:10px; border-bottom:1px solid #e9ecef">
                                <span >姓名:{{data.leaguer?data.leaguer.name:'-'}}</span>
                                <span>手机号：{{data.leaguer?data.leaguer.phone:'-'}}</span>
                                <span>当前欠款: {{data.arrearage.balanceDue|number:'1.2-2'}}</span>
                        </div>
                    
                        <div fxLayout="row"  fxLayoutAlign="space-between start">
                            <div style="width:49%" fxLayout="column" fxLayoutAlign="start" >
                                  <zm-payType-comp [lable]=" '会员卡扣金额' "  [payType]="4"  [balance]="balance" [(zmValue)]="data.payData.memberCard" (callback)="changePayAmount()"></zm-payType-comp>
                                      
                                  <zm-payType-comp [lable]=" '支付宝' "  [payType]="1"  [balance]="0" [(zmValue)]="data.payData.alipay" (callback)="changePayAmount()"></zm-payType-comp>
                                  
                               
                                  <zm-payType-comp [lable]=" '刷卡' "  [payType]="3"  [balance]="0" [(zmValue)]="data.payData.slotCard" (callback)="changePayAmount()"></zm-payType-comp>
                            </div>
                            
                            <div style="width:49%" fxLayout="column" fxLayoutAlign="start"  fxLayoutAlignGap="20px">
                                  
                                      <zm-payType-comp [lable]=" '现金' "  [payType]="0"  [balance]="0" [(zmValue)]="data.payData.cash" (callback)="changePayAmount()"></zm-payType-comp>
                               
                                      <zm-payType-comp [lable]=" '微信' "  [payType]="2"  [balance]="0" [(zmValue)]="data.payData.wechat" (callback)="changePayAmount()"></zm-payType-comp>
                                
                            </div>
                          
                        </div>
                   <div fxLayout="row"  fxLayoutAlign="end" style="width:100%;padding-right: 15px;">
                      <span>实付<i class="fa fa-yen" style="width: 12px;min-width:12px"></i>{{payAmount}}</span>
                    </div>
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="10px">
                  <zm-btn-md  [stroked]="true" (click)="closeModal()" name="取消"></zm-btn-md>
                  <zm-btn-md  (click)="confirm()" name="确定"></zm-btn-md>
            </mat-dialog-actions>
      </div>
    
    
    <!--<div animation-modal>-->
    <!--<div class="modal-header">-->
      <!--<span class="font-bold">还款</span>-->
      <!--<button class="close" aria-label="Close" (click)="closeModal()">-->
        <!--<span aria-hidden="true">&times;</span>-->
      <!--</button>-->
    <!--</div>-->
    <!--<div class="modal-body" style="padding:15px 0">-->
          <!--<div class="disFlex pd-b-1 align-center" style="border-bottom: 1px solid #e9ecef">-->
            <!--<p class="mg-t-20 mg-b-20 pd-l-20 text-left font-bold fz-16 flex">姓名<span class="mg-lr-10">:</span>{{data.leaguer?data.leaguer.name:'-'}}</p>-->
            <!--<p class="mg-t-20 mg-b-20  text-center font-bold fz-16 flex">手机号<span class="mg-lr-10">:</span>{{data.leaguer?data.leaguer.phone:'-'}}</p>-->
            <!--<p class="mg-t-20 mg-b-20 pd-r-20 text-right font-bold fz-16 flex">当前欠款<span class="mg-lr-10">:</span>&yen; {{data.arrearage.balanceDue|number:'1.2-2'}}</p>-->
          <!--</div>-->
      <!---->
          <!--<div class="disFlex mg-t-20 fz-14" style="padding: 0 20px">-->
                      <!--<div class="flex mg-r-20"> -->
                          <!---->
                          <!--<zm-payType-comp [lable]=" '会员卡扣金额' "  [payType]="4"  [balance]="balance" [(zmValue)]="data.payData.memberCard" (callback)="changePayAmount()"></zm-payType-comp>-->
                          <!---->
                          <!--<zm-payType-comp [lable]=" '支付宝' "  [payType]="1"  [balance]="0" [(zmValue)]="data.payData.alipay" (callback)="changePayAmount()"></zm-payType-comp>-->
                          <!---->
                       <!---->
                          <!--<zm-payType-comp [lable]=" '刷卡' "  [payType]="3"  [balance]="0" [(zmValue)]="data.payData.slotCard" (callback)="changePayAmount()"></zm-payType-comp>-->
                          <!---->
                    <!--</div>-->
                    <!--<div class="flex mg-l-20">-->
                    <!---->
                          <!--<zm-payType-comp [lable]=" '现金' "  [payType]="0"  [balance]="0" [(zmValue)]="data.payData.cash" (callback)="changePayAmount()"></zm-payType-comp>-->
                   <!---->
                          <!--<zm-payType-comp [lable]=" '微信' "  [payType]="2"  [balance]="0" [(zmValue)]="data.payData.wechat" (callback)="changePayAmount()"></zm-payType-comp>-->
                       <!---->
                    <!--</div>    -->
                  <!--</div>-->
    <!--</div> -->
           <!---->
           <!---->
          <!--<div class="text-right pd-r-30 modal-footer" style="display:block;">-->
            <!--<div class="disFlex  pd-t-20 align-center mg-b-10">-->
              <!--<div class="text-right" style="font-size: 18px;font-weight: bold;color: #333;width: calc(85% - 20px);">-->
                <!--<p>实付</p>-->
              <!--</div>-->
              <!--<div  style="margin-left:20px;text-align:right;width:15%;">-->
                <!--<p><i class="fa fa-yen mg-r-5"></i>{{payAmount}}</p>-->
              <!--</div>-->
            <!--</div>-->
            <!--<button class="cancel-btn mg-r-20 mg-t-20" (click)="closeModal()">取消</button>-->
            <!--<button class="confirm-btn" (click)="confirm()">确定</button>-->
          <!--</div>-->
    <!--</div>-->
    
  `,
  styleUrls: ["modal.scss"]
})
export class PayPopup implements OnInit,OnDestroy{

  @Input() data:PayPopupViewData;
  @Output() action:any;

  public payAmount:number = 0;//实收金额
  public balance:number = 0;//会员卡余额

  private activeModal: any;
  constructor( @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  // constructor(private router: Router){
  //   //添加路由变化监听
  //   this.router.events.subscribe(event => {
  //     if(event instanceof NavigationStart) {
  //       console.log("NavigationStart=====");
  //     } else if(event instanceof NavigationEnd) {
  //       console.log("NavigationEnd=====");
  //       this.activeModal.close();
  //     } else if(event instanceof NavigationCancel) {
  //       console.log("NavigationCancel=====");
  //     } else if(event instanceof NavigationError) {
  //       console.log("NavigationError=====");
  //     } else if(event instanceof RoutesRecognized) {
  //       console.log("RoutesRecognized=====");
  //     }
  //   });
  // }


  ngOnInit(): void {
    if(this.data && this.data.leaguer){
      this.balance = this.data.leaguer.leaguerMemberCard.balance?this.data.leaguer.leaguerMemberCard.balance:0;
    }
  }

  ngOnDestroy(): void {
  }

  /**
   * 取消
   */
  closeModal() {
    this.activeModal.close();
  }

  /**
   * 确定还款
   */
  confirm(){
    if(this.data.payData.memberCard && !this.checkMemberCardAmount()){
      AppUtils.showWarn("提示","卡扣金额不能大于会员卡余额");
    }else if(AppUtils.roundPoint(this.data.arrearage.balanceDue,2) < this.payAmount){
      AppUtils.showWarn("提示","实付金额不能大于欠款金额");
    }else if(this.payAmount == 0){
      AppUtils.showWarn("提示","请输入有效的还款金额");
    }else{
      this.action(this.payAmount);
      this.closeModal();
    }
  }

  /**
   * 计算实收金额
   */
  changePayAmount() {
    this.payAmount = 0;
    if(this.data.payData.cash){
      this.payAmount = this.payAmount + parseFloat(this.data.payData.cash.toString());
    }
    if(this.data.payData.alipay){
      this.payAmount = this.payAmount + parseFloat(this.data.payData.alipay.toString());
    }
    if(this.data.payData.wechat){
      this.payAmount = this.payAmount + parseFloat(this.data.payData.wechat.toString());
    }
    if(this.data.payData.memberCard){
      this.payAmount = this.payAmount + parseFloat(this.data.payData.memberCard.toString());
    }
    if(this.data.payData.slotCard){
      this.payAmount  = this.payAmount + parseFloat(this.data.payData.slotCard.toString());
    }
    this.payAmount = AppUtils.roundPoint(this.payAmount,2);
  }

  /**
   * 检查卡扣金额是否相符
   */
  checkMemberCardAmount():boolean{
    if(parseFloat(this.data.payData.memberCard.toString()) > parseFloat(this.data.leaguer.leaguerMemberCard.balance.toString())){
      return false;
    }else{
      return true;
    }
  }

}

export class PayPopupViewData{
  public payData:PayData;
  public leaguer:LeaguerDetail;//会员
  public arrearage:Arrearage;//对应操作的欠款记录

  public static fromArrearageDetail(viewDataP:ArrearagesDetailViewData):PayPopupViewData{
    let payPopupViewData = new PayPopupViewData();
    payPopupViewData.payData = viewDataP.payData;
    payPopupViewData.leaguer = viewDataP.leaguer;
    payPopupViewData.arrearage = viewDataP.arrearage;
    return payPopupViewData;
  }
}

