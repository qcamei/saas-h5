import {
  Component, OnInit, Input, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy, Output,
  Inject
} from '@angular/core';
import {AppUtils} from "../../../../comModule/AppUtils";
import {Order} from "../../../../bsModule/order/data/Order";
import {PayItem} from "../../../../bsModule/order/data/PayItem";
import {OrderNotesMgr} from "../../../../bsModule/orderNotes/OrderNotesMgr";
import {ChargeBackRecordAddForm} from "../../../../bsModule/orderNotes/apiData/ChargeBackRecordAddForm";
import {ChargeBackItem} from "../../../../bsModule/orderNotes/data/ChargeBackItem";
import {PayTypeEnum} from "../../../../bsModule/order/data/PayTypeEnum";
import {ChargebackInfoService} from "./ChargebackInfoService";
import {ChargebackInfoViewData, ChargeBackItemData} from "./ChargebackInfoViewData";
import {StoreLeaguerInfoSynDataHolder} from "../../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreGoodsSynDataHolder} from "../../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StorePackageProjectSynDataHolder} from "../../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {OrderViewDataMgr} from "../../orderViewDataMgr";
import {PrdCardPayEnum} from "../../../../bsModule/workFlow/data/PrdCardPayEnum";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'order_chargeback_info',
  template: `
  <!--选择产品-->

    <div  *ngIf="!atChargeInfo" animation-modal class="chargeInfo">

    <div mat-dialog-title>
      <div style="font-size:20px;" class="font-bold">退单</div>
      <!--<button class="close" aria-label="Close" (click)="closeModal()">-->
            <!--<span aria-hidden="true">&times;</span>-->
      <!--</button>-->
    </div>

    <div mat-dialog-content style="max-height:500px;overflow:auto;">
        <div class="font-bold"style="margin-bottom:10px;">选择产品</div>

              <zm-table-detail>
                <thead class="char_th">
                  <th>选择</th>
                  <th>类型</th>
                  <th>分类</th>
                  <th>名称</th>
                  <th>数量/金额</th>
                  <th>已退数量</th>
                  <th>售价</th>
                  <th>支付方式</th>

                </thead>
                <tbody style="text-align: center">
                  <tr [class.itemActiveClass]="viewData.orderChargeBackDataTmp.checked" 
                   [class.itemDisable]="order.realPay==order.chargeBackCost"  (click)="changeClick()" >
                      <td>
                        <span style="display:inline-block;width:30px;">  
                            <input  *ngIf="!viewData.orderChargeBackDataTmp.checked"  type="checkbox" [disabled]="order.realPay==order.chargeBackCost">
                            <img src="assets/images/selectItem.png" *ngIf="viewData.orderChargeBackDataTmp.checked">
                        </span>
                      
                      </td>
                      <td>-</td>
                      <td>-</td>
                      <td>退款</td>
                      <td>￥{{order.realPay}}</td>
                      <td>￥{{order.chargeBackCost}}</td>
                      <td>-</td>
                      <td>- </td>

                  </tr>

                  <tr *ngFor="let item of viewData.chargeBackItemDataList;let i = index;"
                  [class.itemDisable]="item.totalCount==item.refundedCount"  
                  [class.itemActiveClass]="item.checked && (item.totalCount!=item.refundedCount)" (click)="itemClick(item)">
                  <td  style="position:relative">
                    <span  style="display:inline-block;width:30px;">
                      <input  *ngIf="!item.checked" type="checkbox" [disabled]="item.totalCount==item.refundedCount"> 
                      <img src="assets/images/selectItem.png" *ngIf="item.checked">
                    </span>
                  
                  </td>
                  <td>{{item.type|orderBuyTypePipe}}</td>
                  <td>{{item.pgTypeName}}</td>
                  <td>{{item.pgName}}</td>
                  <td>{{item.totalCount}}</td>
                  <td>{{item.refundedCount}}</td>
                  <td>￥{{item.sellPrice}}</td>
                  <td>{{item.payType|prdCardPayPipe}}</td>
                </tr>

                </tbody>
              </zm-table-detail>

    </div>

    <div mat-dialog-actions fxLayout="row" fxLayoutAlign="end">
      <zm-btn-md name="下一步" (zmbtnClick)="chargeNext()"></zm-btn-md>
    </div>

  </div>

  <!--选择产品-->


  <!--退单信息-->
  <div *ngIf="atChargeInfo">
  <div animation-modal class="chargeNext">

    <div mat-dialog-title>
      <div class="font-bold">退单</div>
      <!--<button class="close" aria-label="Close" (click)="closeModal()">-->
            <!--<span aria-hidden="true">&times;</span>-->
      <!--</button>-->
    </div>

    <div mat-dialog-content style="max-height:500px;overflow:auto;">
        <div class="font-bold" style="margin-bottom:10px;">退货信息</div>

              <zm-table-detail>
                <thead class="char_th">
                  <th>产品</th>
                  <th>支付方式</th>
                  <th>售价</th>
                  <th>可退数量</th>
                  <th>退货数量</th>
                  <th>退款金额</th>
                </thead>
                <tbody style="text-align: center">
                  <tr *ngIf="viewData.orderChargeBackDataTmp.checked">
                      <td>退款</td>
                      <td>现结</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>
                        <div class="disFlex">
                          <i fxLayout="row" fxLayoutAlign="center center" class="fa fa-pencil" style="color:#4678fa;"></i>
                          <input class="form-control p-0" type="number" placeholder="可输入金额"
                          [(ngModel)]="viewData.orderChargeBackDataTmp.amount" (ngModelChange)="inputBackAmount()" (keyup)="checkAmountFormat($event)" (blur)="appendZero($event)" />
                        </div>
                      </td>
                  </tr>

                  <tr *ngFor="let item of viewData.chargeBackItemDataListSelected;let i = index;">
                    <td>{{item.pgName?item.pgName:"-"}}</td>
                    <td>{{item.payType|prdCardPayPipe}}</td>
                    <td>{{item.sellPrice?"￥"+(item.sellPrice|number:'1.2-2'):"-"}}</td>
                    <td>{{item.refundableCount}}</td>
                    <td>
                      <div class="disFlex">
                        <i fxLayout="row" fxLayoutAlign="center center" class="fa fa-pencil" style="color:#4678fa;"></i>
                        <input class="form-control  p-0" type="number" [(ngModel)]="item.refundCount" oninput="if(value<0 || value>99999999)value=null" (keyup)="checkInputCount($event,item)">
                      </div>
                    </td>
                    <td>
                      <div class="disFlex" *ngIf="item.payType == 0">
                          <i  fxLayout="row" fxLayoutAlign="center center"  class="fa fa-pencil"style="color:#4678fa;"></i>
                          <input class="form-control p-0" type="number" [(ngModel)]="item.refundAmount" (ngModelChange)="checkInputAmount()" (keyup)="checkAmountFormat($event)" (blur)="appendZero($event)">
                        </div>
                        <div *ngIf="item.payType != 0"><span style="margin:auto 0"></span>-</div>
                    </td>
                  </tr>
                  <tr *ngIf="viewData.chargeBackInfoTmp.beyondMsg">
                    <td colspan="6">
                      <span style="color: red;font-size:12px;float: right;">{{viewData.chargeBackInfoTmp.beyondMsg}}</span>
                    </td>
                  </tr>
                </tbody>
              </zm-table-detail>

              <!--表格形式的支付信息-->

              <div class="font-bold my-8">支付信息
                <span style="padding-left:15px;font-size:14px;color:#969393">*此为该订单整单支付信息，供填写退款信息参考</span>
              </div>
              <zm-table-detail class="w-100-p table table-bordered text-center">
                <thead>
                  <th>分类</th>
                  <th>金额</th>
                </thead>>
                <tbody style="text-align: center">
                <tr>
                  <td>实收</td>
                  <td>￥{{order.realPay|number:'1.2-2'}}</td>
                </tr>
                <tr *ngFor="let item of viewData.payItems">
                  <td>{{item.payType|orderPayTypePipe}}</td>
                  <td>￥{{item.cost|number:'1.2-2'}}</td>
                </tr>
                <tr *ngFor="let item of viewData.chargeBackPayItemList">
                  <td>{{item.payType|chargeBackPayTypePipe}}</td>
                  <td>￥{{item.cost|number:'1.2-2'}}</td>
                </tr>
                </tbody>
              </zm-table-detail>

              <!--支付信息end-->

              <!--退款信息-->
              <div *ngIf="viewData.chargeBackInfoTmp.haveRefundAmount>0">
                 <div class="text-bold my-8">退款信息</div>
               <zm-table-detail>
                <thead>
                  <th style="width:30%">可退金额</th>
                  <th style="width:25%">应退金额</th>
                  <th style="width:20%">退款方式</th>
                  <th style="width:25%">退款金额</th>
                </thead>
                <tbody style="text-align: center">
                  <tr>
                  <td>￥{{viewData.chargeBackInfoTmp.refundableAmount}}</td>
                      <td>￥{{viewData.chargeBackInfoTmp.haveRefundAmount}}</td>
                      <td>
                        <div *ngIf="viewData.chargeBackTypeTmp.withMemCard"  style="padding:6px 0;">会员卡</div>
                        <div *ngIf="viewData.chargeBackTypeTmp.withArrerage"  style="padding:6px 0;">欠款</div>
                        <div *ngIf="viewData.chargeBackTypeTmp.otherWay">
                             <select class="form-control cur-hand"style="margin-top:5px;" [(ngModel)]="viewData.chargeBackTypeTmp.payType">
                              <option [value]="0">现金</option>
                              <option [value]="1">支付宝</option>
                              <option [value]="2">微信</option>
                            </select>
                         </div>
                      </td>
                      <td>
                        <div *ngIf="viewData.chargeBackTypeTmp.withMemCard" class="disFlex">
                          <i  fxLayout="row" fxLayoutAlign="center center"  class="fa fa-pencil"style="color:#4678fa;"></i>
                          <input class="form-control" class="form-control" type="number"  placeholder="可输入金额" [(ngModel)]="viewData.chargeBackTypeTmp.memCardAmount" (ngModelChange)="changeMemCardAmount($event)" (keyup)="checkAmountFormat($event)" (blur)="appendZero($event)">
                        </div>
                        <span *ngIf="viewData.chargeBackTypeTmp.beyondMsgWithMemCard" style="color: red" >
                         {{viewData.chargeBackTypeTmp.beyondMsgWithMemCard}}
                        </span>

                        <div *ngIf="viewData.chargeBackTypeTmp.withArrerage"  class="disFlex">
                          <i  fxLayout="row" fxLayoutAlign="center center"  class="fa fa-pencil" style="color:#4678fa;"></i>
                          <input class="form-control" type="number"  placeholder="可输入金额" [(ngModel)]="viewData.chargeBackTypeTmp.arrerageAmount" (ngModelChange)="changeArrerageAmount($event)" (keyup)="checkAmountFormat($event)" (blur)="appendZero($event)">
                        </div>
                        <span *ngIf="viewData.chargeBackTypeTmp.beyondMsgWithArrerage" style="color: red" >
                          {{viewData.chargeBackTypeTmp.beyondMsgWithArrerage}}
                        </span>
                        <div *ngIf="viewData.chargeBackTypeTmp.otherWay"  class="disFlex">
                          <i  fxLayout="row" fxLayoutAlign="center center"  class="fa fa-pencil" style="color:#4678fa;"></i>
                          <input class="form-control" type="number"  placeholder="可输入金额" [(ngModel)]="viewData.chargeBackTypeTmp.otherWayAmount" (ngModelChange)="changeOtherWayAmount()" (keyup)="checkAmountFormat($event)" (blur)="appendZero($event)">
                        </div>
                      </td>
                  </tr>
                  <tr *ngIf="viewData.chargeBackTypeTmp.beyondMsg">
                    <td colspan="4">
                      <span style="color: red;font-size:12px;float: right;">{{viewData.chargeBackTypeTmp.beyondMsg}}</span>
                    </td>
                  </tr>
                </tbody>
              </zm-table-detail>
              </div>
              <!--退款信息-->

              <!--退单原因-->
              <div class="mt-8">
              <zm-input-textarea [label]="'退单原因'"  [maxlength]="200" [placeholder]="'备注信息'" [(text)]="viewData.chargeBackInfoTmp.refundReason" ></zm-input-textarea>

              <!--  <div class="font-bold" style="margin-bottom:10px;">退单原因</div>
                <textarea class="form-control" rows="3" maxlength="200" placeholder="请输入200字以内的备注" [(ngModel)]="viewData.chargeBackInfoTmp.refundReason"></textarea>-->
              </div>
              <!--退单原因-->

      </div>
      <div mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
        <zm-btn-md stroked="true" name="上一步" (zmbtnClick)="chargeInfo()">上一步</zm-btn-md>
        <zm-btn-md name="退单" (click)="chargeBack()">退单</zm-btn-md>
      </div>

    </div>

  </div>
  <!--退单信息-->


`,
  styleUrls: ['chargebackInfo.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ChargebackInfoComp implements OnInit,OnDestroy {

  @Input() order: Order;
  @Output() callbackFun: () => void;

  private service: ChargebackInfoService;
  public viewData: ChargebackInfoViewData;
  private viewDataSub: any;
  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) dataInput:any,
              private orderNotesMgr: OrderNotesMgr,
              private orderViewDataMgr: OrderViewDataMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private cdRef: ChangeDetectorRef) {
    this.activeModal = dataInput.modalCtrl;
    this.service = new ChargebackInfoService(
      this.orderNotesMgr,
      this.orderViewDataMgr,
      this.storeLeaguerInfoSynDataHolder,
      this.storeProductInfoSynDataHolder,
      this.storeGoodsSynDataHolder,
      this.storePackageProjectSynDataHolder,
      this.storeCardInfoSynDataHolder);
  }

  ngOnInit() {
    this.viewDataSub = this.orderViewDataMgr.subscribeChargebackInfoVD((viewDataP: ChargebackInfoViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData(this.order);
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  /****************业务 事件******************/
    //下一步
  public atChargeInfo = false;

  public chargeNext() {
    //退款项列表
    this.setSelectedList();
    //判断是否选中
    this.checkHasSelected();
    //计算退款项单个退款金额
    this.calRefundAmount();
    //计算应退金额
    this.setHaveRefundAmount();
  }

  private setSelectedList() {
    this.viewData.chargeBackItemDataListSelected = this.viewData.chargeBackItemDataList.filter((item) => {
      if (item.checked == true) {
        return true;
      }
    });
    AppUtils.uniquelize(this.viewData.chargeBackItemDataListSelected);
  }

  private checkHasSelected() {
    if (this.viewData.chargeBackItemDataListSelected.length == 0
      && this.viewData.orderChargeBackDataTmp.checked == false) {
      AppUtils.showWarn("提示", "请至少选择一个退款项");
      return;
    }
    this.atChargeInfo = true;
  }

  private calRefundAmount() {
    let refundableAmount = this.viewData.chargeBackInfoTmp.refundableAmount;
    let totalAmount = 0;
    this.viewData.chargeBackItemDataList.forEach((item) => {//总金额
      if (item.payType == PrdCardPayEnum.CashPay) {
        totalAmount += item.sellPrice * item.refundableCount;
      }
    });

    let rate = refundableAmount / totalAmount;
    let amount = 0;
    let selectedTotalAmount = 0;
    for (let i in this.viewData.chargeBackItemDataListSelected) {
      let item = this.viewData.chargeBackItemDataListSelected[i];
      if (item.payType == PrdCardPayEnum.CashPay) {
        selectedTotalAmount += item.sellPrice * item.refundableCount;
      }
      if (item.payType == PrdCardPayEnum.CashPay) {
        if (this.viewData.chargeBackItemDataListSelected.length>2 && parseInt(i) < this.viewData.chargeBackItemDataListSelected.length - 1) {
          item.refundAmount = item.sellPrice * rate;
          item.refundAmount = AppUtils.roundPoint(item.refundAmount, 2);
          amount += item.refundAmount;
          amount = AppUtils.roundPoint(amount, 2);
        }
        if (this.viewData.chargeBackItemDataListSelected.length>2 && parseInt(i) == this.viewData.chargeBackItemDataListSelected.length - 1) {
          item.refundAmount = selectedTotalAmount - amount;
          item.refundAmount = this.formatAmount(item.refundAmount);
        }
      }

    }
  }

  //上一步
  public chargeInfo() {
    this.atChargeInfo = false;
  }

  //退单
  public async chargeBack() {
    if (this.checkInput()) {
      let inputForm = this.buildInputForm();
      let target = await this.orderNotesMgr.addChargeBackRecord(this.order.id, inputForm);
      if (target == null) {
        AppUtils.showError("提示", "退单失败");
        this.closeModal();
      } else {
        AppUtils.showSuccess("提示", "退单成功");
        this.closeModal();
        this.callbackFun();
      }
    }

  }

  private checkInput() {
    let target = true;
    if (this.viewData.chargeBackTypeTmp.beyondMsgWithArrerage != ""
      || this.viewData.chargeBackTypeTmp.beyondMsgWithMemCard != ""
      || this.viewData.chargeBackInfoTmp.beyondMsg != ""
      || this.viewData.chargeBackTypeTmp.beyondMsg) {
      AppUtils.showWarn("提示", "请检查输入是否合法");
      target = false;
      return;
    }
    let memCardAmount = this.formatFloat(this.viewData.chargeBackTypeTmp.memCardAmount);
    let arrerageAmount = this.formatFloat(this.viewData.chargeBackTypeTmp.arrerageAmount);
    let otherWayAmount = this.formatFloat(this.viewData.chargeBackTypeTmp.otherWayAmount);
    let haveRefundAmount = this.formatFloat(this.viewData.chargeBackInfoTmp.haveRefundAmount);
    if ((memCardAmount + arrerageAmount + otherWayAmount) != haveRefundAmount) {
      AppUtils.showWarn("提示", "退款金额应等于应退金额");
      target = false;
    }
    return target;
  }

  private buildInputForm() {
    let inputForm: ChargeBackRecordAddForm = new ChargeBackRecordAddForm();
    inputForm.chargeBackItems = this.buildChargeBackItems();
    inputForm.payItems = this.buildPayItems();
    inputForm.remark = this.viewData.chargeBackInfoTmp.refundReason;
    return inputForm;
  }

  private buildChargeBackItems() {
    let chargeBackItems: Array<ChargeBackItem> = new Array<ChargeBackItem>();
    for (let item of this.viewData.chargeBackItemDataListSelected) {
      let chargeBackItem = new ChargeBackItem();
      chargeBackItem.itemId = item.itemId;
      chargeBackItem.pgName = item.pgName;
      chargeBackItem.pgId = item.pgId;
      chargeBackItem.cost = item.refundAmount;
      chargeBackItem.count = item.refundCount;
      chargeBackItem.buyType = item.type;
      chargeBackItems.push(chargeBackItem);
    }
    //仅退款
    if (this.viewData.orderChargeBackDataTmp.checked == true) {
      let chargeBackItem = new ChargeBackItem();
      chargeBackItem.itemId = "";
      chargeBackItem.pgName = "退款";
      chargeBackItem.cost = this.viewData.orderChargeBackDataTmp.amount;
      chargeBackItems.push(chargeBackItem);
    }
    return chargeBackItems;
  }

  private buildPayItems() {
    let payItems: Array<PayItem> = new Array<PayItem>();
    if (this.viewData.chargeBackTypeTmp.memCardAmount > 0) {
      let payItem = new PayItem();
      payItem.payType = PayTypeEnum.MEMBERSHIPCARD;
      payItem.cost = this.viewData.chargeBackTypeTmp.memCardAmount;
      payItems.push(payItem);
    }
    if (this.viewData.chargeBackTypeTmp.arrerageAmount > 0) {
      let payItem = new PayItem();
      payItem.payType = PayTypeEnum.ARREARAGE;
      payItem.cost = this.viewData.chargeBackTypeTmp.arrerageAmount;
      payItems.push(payItem);

    }
    if (this.viewData.chargeBackTypeTmp.otherWayAmount > 0) {
      let payItem = new PayItem();
      payItem.payType = this.viewData.chargeBackTypeTmp.payType;
      payItem.cost = this.viewData.chargeBackTypeTmp.otherWayAmount;
      payItems.push(payItem);
    }
    return payItems;
  }

  closeModal() {
    this.activeModal.close();
  }

  /************交互 事件***************/
  changeClick() {
    if (this.order.realPay == this.order.chargeBackCost) {
      return;
    }
    this.viewData.orderChargeBackDataTmp.checked = !this.viewData.orderChargeBackDataTmp.checked;
  }

  itemClick(items) {
    if (items.totalCount == items.refundedCount) {
      return;
    }
    items.checked = !items.checked;
  }

  //金额格式校验
  checkAmountFormat(e) {
    if (!AppUtils.isNumber(e.target.value.toString())) {
      e.target.value = "0";
    } else {
      if (e.target.value < 0 || e.target.value > 99999999) {
        e.target.value = "0";
      }
      e.target.value = AppUtils.roundPoint(e.target.value, 2);
    }
  }

  appendZero(e) {
    e.target.value = AppUtils.appendZero(e.target.value);

    this.changeArrerageAmount();
    this.changeMemCardAmount();
    this.changeOtherWayAmount();
  }

  /*****************退货信息  相关交互********************/

  //仅退款-输入退款金额
  public inputBackAmount() {
    this.setHaveRefundAmount();
  }

  //退货数量输入计算
  public checkInputCount(e, item: ChargeBackItemData) {
    if (parseInt(e.target.value) > parseInt(item.refundableCount.toString())) {
      e.target.value = item.refundableCount;
    }
    item.refundCount = e.target.value;
    item.refundAmount = item.refundCount * item.sellPrice;
    this.setHaveRefundAmount();
  }

  //退货金额输入计算
  public checkInputAmount() {
    this.setHaveRefundAmount();
  }

  //设置应退金额
  private setHaveRefundAmount() {
    this.viewData.chargeBackInfoTmp.haveRefundAmount = this.formatAmount(this.getTotalRefundAmount());

    if(this.formatFloat(this.viewData.orderChargeBackDataTmp.amount) > 0){
      this.viewData.chargeBackInfoTmp.haveRefundAmount =
        this.formatFloat(this.viewData.chargeBackInfoTmp.haveRefundAmount) + this.formatFloat(this.viewData.orderChargeBackDataTmp.amount);
      this.viewData.chargeBackInfoTmp.haveRefundAmount = this.formatAmount(this.viewData.chargeBackInfoTmp.haveRefundAmount);
    }
    if(this.formatFloat(this.viewData.chargeBackInfoTmp.haveRefundAmount) > this.formatFloat(this.viewData.chargeBackInfoTmp.refundableAmount)){
      let amount = this.viewData.chargeBackInfoTmp.haveRefundAmount - this.viewData.chargeBackInfoTmp.refundableAmount;
      amount = this.formatAmount(amount);
      this.viewData.chargeBackInfoTmp.beyondMsg = "已超出可退金额：" + amount + "元";
    } else {
      this.viewData.chargeBackInfoTmp.beyondMsg = "";
    }
  }

  //退款项总的退款金额
  private getTotalRefundAmount() {
    let totalRefundAmount = 0;
    if (this.viewData.chargeBackItemDataListSelected.length > 0) {
      this.viewData.chargeBackItemDataListSelected.forEach((item) => {
        if (item.payType == PrdCardPayEnum.CashPay) {
          if (item.refundAmount) {
            totalRefundAmount += parseFloat(item.refundAmount.toString());
            totalRefundAmount = AppUtils.roundPoint(totalRefundAmount, 2);
          }
        }
      });
    }
    return totalRefundAmount;
  }

  /*****************退款信息 相关交互*******************/

  //使用会员卡退款
  public changeMemCardAmount() {
    this.viewData.chargeBackTypeTmp.beyondMsgWithMemCard = "";
    if(this.formatFloat(this.viewData.chargeBackTypeTmp.memCardAmount) > this.formatFloat(this.viewData.chargeBackTypeTmp.memCardBalance)) {
      this.viewData.chargeBackTypeTmp.memCardBalance = this.formatAmount(this.viewData.chargeBackTypeTmp.memCardBalance);
      if(this.viewData.chargeBackTypeTmp.memCardBalance>0){
        this.viewData.chargeBackTypeTmp.beyondMsgWithMemCard = "已超出会员卡可退金额： " + this.viewData.chargeBackTypeTmp.memCardBalance + "元";
      }
      return;
    }
    this.setTotalRefundAmount();
  }

  //使用欠款退款
  public changeArrerageAmount() {
    this.viewData.chargeBackTypeTmp.beyondMsgWithArrerage = "";
    if (this.formatFloat(this.viewData.chargeBackTypeTmp.arrerageAmount) > this.formatFloat(this.viewData.chargeBackTypeTmp.arrerageBalance)) {
      this.viewData.chargeBackTypeTmp.arrerageBalance = this.formatAmount(this.viewData.chargeBackTypeTmp.arrerageBalance);
      if(this.viewData.chargeBackTypeTmp.arrerageBalance>0){
        this.viewData.chargeBackTypeTmp.beyondMsgWithArrerage = "已超出欠款可退金额： " + this.viewData.chargeBackTypeTmp.arrerageBalance + "元";
      }
    }
    this.setTotalRefundAmount();
  }

  //使用其他方式退款
  public changeOtherWayAmount() {
    this.setTotalRefundAmount();
  }

  //校验总的退款金额是否等于应退金额
  private setTotalRefundAmount() {
    //总金额
    let totalAmount = this.calTotalAmount();
    //判断
    if(this.formatFloat(this.viewData.chargeBackInfoTmp.haveRefundAmount)<= this.formatFloat(this.viewData.chargeBackInfoTmp.refundableAmount)) {
      if (totalAmount != this.viewData.chargeBackInfoTmp.haveRefundAmount) {
        if (totalAmount > this.viewData.chargeBackInfoTmp.haveRefundAmount) {
          let amount = totalAmount - this.viewData.chargeBackInfoTmp.haveRefundAmount;
          amount = this.formatAmount(amount);
          this.viewData.chargeBackTypeTmp.beyondMsg = "已超出应退金额:" + amount + "元";
        } else {
          let amount = this.viewData.chargeBackInfoTmp.haveRefundAmount - totalAmount;
          amount = this.formatAmount(amount);
          this.viewData.chargeBackTypeTmp.beyondMsg = "还需退款: " + amount + "元";
        }
      } else {
        this.viewData.chargeBackTypeTmp.beyondMsg = "";
      }
    }
  }

  private calTotalAmount() {
    let totalAmount = 0;
    if (this.viewData.chargeBackTypeTmp.memCardAmount > 0) {
      totalAmount += this.formatFloat(this.viewData.chargeBackTypeTmp.memCardAmount);
    }
    if (this.viewData.chargeBackTypeTmp.arrerageAmount > 0) {
      totalAmount += this.formatFloat(this.viewData.chargeBackTypeTmp.arrerageAmount);
    }
    if (this.viewData.chargeBackTypeTmp.otherWayAmount > 0) {
      totalAmount += this.formatFloat(this.viewData.chargeBackTypeTmp.otherWayAmount);
    }
    totalAmount = AppUtils.roundPoint(totalAmount, 2);
    return totalAmount;
  }

  private formatFloat(amount: number):number{
    if (amount) {
      return parseFloat(amount.toString());
    }else{
      return parseFloat(AppUtils.appendZero(0));
    }
  }

  private formatAmount(amount: number){
   if(amount){
     amount = AppUtils.roundPoint(amount, 2);
     amount = AppUtils.appendZero(amount);
   } else{
     amount = AppUtils.appendZero(0);
   }
    return amount;
  }
}

