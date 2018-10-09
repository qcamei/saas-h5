import {
  Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, Input, Output,
  EventEmitter
} from "@angular/core";
import {OrderViewDataMgr} from "../orderViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {BonusRecordMgr} from "../../../bsModule/bonusRecord/BonusRecordMgr";
import {StaffData, SelectStaffComp} from "../../storeflow/selectStaffComp/selectStaffComp";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {OrderDetailMgr} from "../../../bsModule/orderDetail/OrderDetailMgr";
import {EditConsumeBonusService} from "./EditConsumeBonusService";
import {EditConsumeBonusViewData, OrderBonusData} from "./EditConsumeBonusViewData";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**
 * 订单管理 修改提成 (开单收银) 组件
 */
@Component({
  selector: 'edit-consume-bonus-comp',
  template: `

        <zm-card [withCollapse]="false"  [header]="'服务提成'" >
      
          <zm-table-detail style="text-align:center">
                <thead>
                <th>类型</th>
                <th>名称</th>
                <th>结算方式</th>
                <th>服务人员</th>
                </thead>
                <tbody>
                <tr *ngFor="let item of viewData.orderBonusList">
                  <td>{{item.buyType | orderItemTypePipeComp}}</td>
                  <td>{{item && item.pgName?item.pgName:"-"}}</td>
                  <td>{{item.payType == 0?'现结':'划卡'}}</td>
                  <td>
                     <div style=" cursor: pointer; width:100%;" fxLayout="row" fxLayoutGap="2px" fxLayoutAlign="end center" (click)="setServicePerson(item)">
                        <span style="padding-top: 7px;"> {{item.staffName}}<i class="fa fa-plus color-theme" md-colors="{color:'primary'}"></i></span>
                     </div>
                  </td>
                </tr>
                </tbody>
          </zm-table-detail>
        
          <div style="margin-top: 15px" fxLayout="row" fxLayoutAlign="end"><zm-btn-md name="保存" (zmbtnClick)="save()"></zm-btn-md></div>
        </zm-card>
    
      <!--基本信息-->        
      <zm-card>
      
        <zm-table-detail style="text-align:center">
            <thead>
            <th>创建时间</th>
            <th>付款时间</th>
            <th>订单编号</th>
            <th>订单类型</th>
            <th>跟进人员</th>
            <th>应结金额</th>
            <th>订单状态</th>
            </thead>
            <tbody>
            <tr>
              <td>{{viewData.simpleOrderInfo.createdTime|times}}</td>
              <td>{{viewData.simpleOrderInfo.payTime |times}}</td>
              <td>{{viewData.simpleOrderInfo.number?viewData.simpleOrderInfo.number:"-"}}</td>
              <td>{{viewData.simpleOrderInfo.orderType|orderTypePipe}}</td>
              <td>{{viewData.simpleOrderInfo.buserName?viewData.simpleOrderInfo.buserName:"-"}}</td>
              <td>￥{{viewData.simpleOrderInfo.cost?(viewData.simpleOrderInfo.cost|number:'1.2-2'):"-"}}</td>
              <td>{{viewData.simpleOrderInfo.status |orderStatusPipe}}</td>
            </tr>
            </tbody>
        </zm-table-detail>
     
      </zm-card>
    <!--基本信息-->


    <!-- 划卡信息 -->
      <zm-card  [header]="'划卡信息'"  *ngIf="viewData.delimitCardDetails.length!=0">

        <zm-table-detail style="text-align:center">
            <thead>
            <th>类型</th>
            <th>所属次卡</th>
            <th>名称</th>
            <th>售价</th>
            <th>消费次数</th>
            </thead>
            <tbody>
            <tr *ngFor="let item of viewData.delimitCardDetails">
              <td>{{item.itemType|itemTypePipe}}</td>
              <td>{{item.prdCardName?item.prdCardName:"-"}}</td>
              <td>{{item.pgName?item.pgName:"-"}}</td>
              <td>￥{{item.price?(item.price|number:'1.2-2'):"-"}}</td>
              <td>{{item.count?item.count:"-"}}</td>
            </tr>
            </tbody>
        </zm-table-detail>
        
      </zm-card>
    <!-- 划卡信息 -->


    <!-- 购买信息 -->
      <zm-card  [header]="'购买信息'"  *ngIf="viewData.buyDetails.length!=0">
        <zm-table-detail style="text-align:center">
              <thead>
              <th>类型</th>
              <th>名称</th>
              <th>原价</th>
              <th>售价</th>
              <th>数量</th>
              <th>折扣</th>
              <th>总价</th>
              <th>应付</th>
              </thead>
              <tbody>
              <tr *ngFor="let item of viewData.buyDetails">
                <td>{{item && item.buyType | orderItemTypePipeComp}}</td>
                <td>{{item && item.pgName?item.pgName:"-"}}</td>
                <td>&yen; {{item && item.oldPrice?(item.oldPrice| number:'1.2-2'):"-"}}</td>
                <td>&yen; {{item && item.price?(item.price| number:'1.2-2'):"-"}}</td>
                <td>{{item && item.count?item.count:"-"}}</td>
                <td>{{item && item.discount|discountPipe}}</td>
                <td>&yen; {{item && item.cost?(item.cost| number:'1.2-2'):"-"}}</td>
                <td>&yen; {{item && item.pay?(item.pay| number:'1.2-2'):"-"}}</td>
              </tr>
              </tbody>
          </zm-table-detail>
         
       <p class="font-bold fz-16 text-right mg-t-20 pd-r-20" style="margin-bottom: 0;">
          合计：￥{{viewData.buyDetailsTotalPrice?(viewData.buyDetailsTotalPrice| number:'1.2-2'):"-"}}
        </p>
      </zm-card>
    <!-- 购买信息 -->


    <!-- 赠品信息 -->
    <zm-card  [header]="'赠品信息'"  *ngIf="viewData.donateDetails.length!=0">
          <zm-table-detail style="text-align:center">
                <thead>
                <th>类型</th>
                <th>名称</th>
                <th>原价</th>
                <th>数量</th>
                <th>总价</th>
                </thead>
                <tbody>
                <tr *ngFor="let item of viewData.donateDetails">
                  <td>{{item && item.buyType | orderItemTypePipeComp}}</td>
                  <td>{{item && item.pgName?item.pgName:"-"}}</td>
                  <td>&yen; {{item && item.price?(item.price| number:'1.2-2'):"-"}}</td>
                  <td>{{item && item.count?item.count:"-"}}</td>
                  <td>&yen; {{item && item.cost?(item.cost| number:'1.2-2'):"-"}}</td>
                </tr>
                </tbody>
          </zm-table-detail>
    </zm-card>
    <!-- 赠品信息 -->

`,
  styles: [`
.btn{
  padding: 0.75rem 0.35rem;
}
thead th {
  font-weight: bold;
  background-color: #f4f6fa !important;
  border-bottom-width: 1px !important;
}
tbody tr{
  margin-top: -1px;
}
tbody tr:nth-of-type(odd){
  background-color: #ffffff;
}
tbody tr:nth-of-type(even),tbody tr:nth-of-type(even) input,tbody tr:nth-of-type(even) select{
  background-color:#f9fafc;
}
tbody .c-tr:hover{
  background-color: #e7f3fd;
}
tbody a{cursor:pointer;}
tbody a:hover{text-decoration: none;color:#03a9f4 !important;}

th, td{
  vertical-align: middle !important;
  font-size: 14px;
  word-wrap:break-word;
  word-break: break-all;
}
.table-bordered thead th{
  border-bottom-width: 1px !important;
}
select.form-control:not([size]):not([multiple]){
  -moz-appearance: none;
  -webkit-appearance: none;
  background-image:url(../../../../assets/images/arrow.png);
  background-repeat: no-repeat;
  background-position:95% 50%;
  font-size: 14px;
  padding-right: 25px;
}
select.c-form-select:not([size]):not([multiple]){
  -moz-appearance: none;
  -webkit-appearance: none;
  background-image:url(../../../../assets/images/arrow.png);
  background-repeat: no-repeat;
  background-position:95% 50%;
  font-size: 14px;
  padding-right: 25px;
}
select::-ms-expand { display: none; }
input[type=number] {
  -moz-appearance: textfield;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
button:focus{
  box-shadow: none;
}
.table {
  font-size: 14px;
  margin-bottom: 0;
}
.mg-b-20{
  margin-bottom:20px;
}
.mg-t-10{
  margin-top:10px;
}
.mg-t-20{
  margin-top:20px;
}
.pd-r-20{
  padding-right:20px;
}
.pd-lr-30{
  padding-left:30px;
  padding-right:30px;
}
.align-center{
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  -moz-box-align: center;
  align-items: center;
}
.fz-18{
  font-size:18px;
}
.fz-16{
  font-size:16px;
}
.font-bold{
  font-weight: bold;
}
.text-center{
  text-align: center;
}
.text-right{
  text-align: right;
}
.pos-r{
  position: relative;
}
.pos-a{
  position: absolute;
}
.color-theme{
  color:#03a9f4;
}

.fa fa-plus {
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  /* IE 9 */
  -moz-transform: translateY(-50%);
  /* Firefox */
  -webkit-transform: translateY(-50%);
  /* Safari 和 Chrome */
  -o-transform: translateY(-50%);
}

`],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditConsumeBonusComp implements OnInit,OnDestroy {

  @Input() orderId:string;
  @Output() callback:EventEmitter<any> = new EventEmitter<any>();
  private viewDataSub: any;
  private service: EditConsumeBonusService;
  public viewData: EditConsumeBonusViewData;

  constructor(private matDialog: MatDialog,
              private bonusRecordMgr: BonusRecordMgr,
              private orderViewDataMgr: OrderViewDataMgr,
              private storeClerkInfoMgr: StoreClerkInfoMgr,
              private buserMgr: BUserMgr,
              private orderDetailMgr: OrderDetailMgr,
              private cdRef: ChangeDetectorRef) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new EditConsumeBonusService(this.bonusRecordMgr, this.storeClerkInfoMgr, this.buserMgr, this.orderViewDataMgr, this.orderDetailMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.orderViewDataMgr.subscribeEditConsumeBonusVD((viewDataP: EditConsumeBonusViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    if(!AppUtils.isNullObj(this.orderId) && !AppUtils.isNullOrWhiteSpace(this.orderId)){
      this.service.initViewData(this.orderId);
    }
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 点击事件 保存提成信息
   */
  save(){
    this.service.saveBonusList(this.viewData.simpleOrderInfo,this.viewData.orderBonusList, (success: boolean) => {
      if (success) {
        AppUtils.showSuccess("提示", "保存成功");
        this.callback.emit();
      }else{
        AppUtils.showError("提示","保存失败");
      }
    });
  }

  /**
   * 弹出设置服务人员提成窗口
   * @param item
   */
  setServicePerson(item: OrderBonusData): void {
    const activeModal = ZmModalMgr.getInstance().newModal(SelectStaffComp);
    activeModal.componentInstance.data = item.staffBonusList;
    activeModal.componentInstance.amount = item.amount;
    activeModal.componentInstance.action = this.selectStaffCallback.bind(this, item);
  }

  /**
   * 选择服务人员回调
   * @param staffList
   */
  selectStaffCallback(orderItem: OrderBonusData, staffList: Array<StaffData>): void {
    let orderBonusDataTmp = new OrderBonusData();
    AppUtils.copy(orderBonusDataTmp, orderItem);
    orderBonusDataTmp.staffBonusList = [];
    let staffNameArr = [];
    for (let i = 0; i < staffList.length; i++) {
      let staffData = staffList[i];
      orderBonusDataTmp.staffBonusList.push(staffData);
      staffNameArr.push(staffData.name);
    }
    orderBonusDataTmp.staffName = staffNameArr.join("、");
    AppUtils.copy(orderItem, orderBonusDataTmp);
    this.orderViewDataMgr.setEditConsumeBonusViewData(this.viewData);
  }

  /**
   * 修改提成
   */
  updateBonusRecord(orderBonusData: OrderBonusData, callbackP: (successP: boolean) => void) {
    this.service.updateBonusRecord(this.viewData.simpleOrderInfo, orderBonusData, (success: boolean) => {
      if (success) {
        AppUtils.showSuccess("提示", "修改成功");
        callbackP(success);
        this.callback.emit();
        // AppRouter.goOrderList();
      } else {
        AppUtils.showError("提示", "修改失败");
      }
    })
  }

}



