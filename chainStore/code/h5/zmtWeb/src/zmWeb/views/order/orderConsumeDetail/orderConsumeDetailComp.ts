import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, Input} from "@angular/core";
import {OrderViewDataMgr} from "../orderViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {OrderDetailMgr} from "../../../bsModule/orderDetail/OrderDetailMgr";
import {OrderDetail} from "../../../bsModule/orderDetail/data/OrderDetail";
import {SimpleOrderInfo} from "../../../bsModule/orderDetail/data/SimpleOrderInfo";
import {SimpleLeaguerInfo} from "../../../bsModule/orderDetail/data/SimpleLeaguerInfo";
import {DelimitCardDetail} from "../../../bsModule/orderDetail/data/DelimitCardDetail";
import {BuyDetail} from "../../../bsModule/orderDetail/data/BuyDetail";
import {DonateDetail} from "../../../bsModule/orderDetail/data/DonateDetail";
import {ChargeBackDetail} from "../../../bsModule/orderDetail/data/ChargeBackDetail";
import {OrderRemark} from "../../../bsModule/orderDetail/data/OrderRemark";
import {PayItem} from "../../../bsModule/order/data/PayItem";
import {ChargebackReasonComp} from "../Comp/chargebackReason/chargebackReason";
import {UserBonusDetail} from "../../../bsModule/order/data/UserBonusDetail";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**
 * 订单管理 订单详情 (开单收银) 组件
 */
@Component({
  selector:'order-consume-detail-comp',
  template:`
            <!--基本信息-->
           <zm-card  [header]="'基本信息'">
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
                        <td>{{viewData.simpleOrderInfo.cost?(viewData.simpleOrderInfo.cost|number:'1.2-2'):"-"}}</td>
                        <td>{{viewData.simpleOrderInfo.status |orderStatusPipe}}</td>
                      </tr>
                      </tbody>
                  </zm-table-detail>
            </zm-card>
            <!--基本信息-->
            
            
            <!--会员信息-->
           <zm-card  [header]="'会员信息'">
                  
                  <zm-table-detail style="text-align:center">
                      <thead>
                      <th>会员姓名</th>
                      <th>手机号</th>
                      <th>会员卡</th>
                      <th>项目折扣</th>
                      <th>商品折扣</th>
                      <th>次卡折扣</th>
                      <th>套餐折扣</th>
                      </thead>
                      <tbody>
                      <tr>
                        <td>{{viewData.simpleLeaguerInfo.name?viewData.simpleLeaguerInfo.name:'-'}}</td>
                        <td>{{viewData.simpleLeaguerInfo.phone&&(viewData.simpleLeaguerInfo.phone!='0')?viewData.simpleLeaguerInfo.phone:'-'}}</td>
                        <td>{{viewData.simpleLeaguerInfo.memberCardName?viewData.simpleLeaguerInfo.memberCardName:'-'}}</td>
                        <td>{{viewData.simpleLeaguerInfo.prodDiscount|discountPipe}}</td>
                        <td>{{viewData.simpleLeaguerInfo.goodsDiscount|discountPipe}}</td>
                        <td>{{viewData.simpleLeaguerInfo.prdCardDiscount |discountPipe}}</td>
                        <td>{{viewData.simpleLeaguerInfo.packagePrjDiscount |discountPipe}}</td>
                      </tr>
                      </tbody>
                  </zm-table-detail>
                  
            </zm-card>
            <!--会员信息-->
            
            
            <!-- 划卡信息 -->
            <zm-card *ngIf="viewData.delimitCardDetails.length!=0" [header]="'划卡信息'">
            
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
            <zm-card *ngIf="viewData.buyDetails.length!=0" [header]="'购买信息'">
                  
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
             <zm-card *ngIf="viewData.donateDetails.length!=0" [header]="'赠品信息'">
                  
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
            
            
            <!-- 退单信息 -->
           <zm-card *ngIf="viewData.chargeBackDetails.length!=0" [header]="'退单信息'">
           
                <zm-table-detail style="text-align:center">
                      <thead>
                      <th>创建时间</th>
                      <th>退单流水号</th>
                      <th>操作人</th>
                      <th>退单名称</th>
                      <th>退单金额</th>
                      <th>退单量</th>
                      <th>退单方式</th>
                      <th>退单原因</th>
                      </thead>
                      <tbody>
                      <tr *ngFor="let item of viewData.chargeBackDetails">
                        <td>{{item.createTime|times}}</td>
                        <td>{{item.number?item.number:"-"}}</td>
                        <td>{{item.creatorName?item.creatorName:"-"}}</td>
                        <td>
                          <p *ngFor="let chargeBackItemName of item.chargeBackItems;">{{chargeBackItemName.pgName?chargeBackItemName.pgName:"-"}}</p>
                        </td>
                        <td>
                          <p *ngFor="let chargeBackItemCost of item.chargeBackItems;">{{chargeBackItemCost.cost?(chargeBackItemCost.cost|number:'1.2-2'):"-"}}</p>
                        </td>
                        <td>
                          <p *ngFor="let chargeBackItemCount of item.chargeBackItems;">{{chargeBackItemCount.count!=0?chargeBackItemCount.count:"-"}}</p>
                        </td>
                        <td>
                          <div class="disFlex" *ngFor="let payItem of item.payItems;">
                            <span style="width:40%;text-align: right; margin-right:10px;">{{payItem.payType|orderPayTypePipe}}</span>
                            <span style="width:60%;text-align: left"> ￥{{payItem.cost?(payItem.cost|number:'1.2-2'):"-"}}</span>
                          </div>
                          
                          <div *ngIf="!item.payItems">
                            <span style="width:100%;text-align: center;">-</span>
                          </div>
                          
                        </td>
                        <td>
                            <a class="zmCurHand" (click)="lookReason(item.remark)">查看</a>
                        </td>
                      </tr>
                      </tbody>
                 </zm-table-detail>
                
                 <p class="font-bold fz-16 text-right mg-t-20 pd-r-20" style="margin-bottom: 0;">
                    退款合计：￥{{viewData.chargeBackTotalAmount?(viewData.chargeBackTotalAmount| number:'1.2-2'):"-"}}
                  </p>
            </zm-card>
            <!-- 退单信息 -->
            
            
            <!-- 订单备注 -->
           <zm-card *ngIf="viewData.orderRemark.remark" [header]="'订单备注'">
                <zm-table-detail>
                    <tbody style="text-align: center">
                        <tr>
                          <td>来源</td>
                          <td>备注内容</td>
                        </tr>
                        <tr>
                          <td>收银</td>
                          <td>{{viewData.orderRemark.remark?viewData.orderRemark.remark:"-"}}</td>
                        </tr>
                    </tbody>
                  </zm-table-detail>
           </zm-card>       
            <!-- 订单备注 -->
            
            
            <!--支付收款-->
           <zm-card *ngIf="viewData.payItems.length!=0" [header]="'支付收款'">
                  <zm-table-detail>
                    <tbody style="text-align: center">
                    <tr *ngFor="let payItemTmp of viewData.payItems;">
                      <td >{{payItemTmp.payType|orderPayTypePipe}}</td>
                      <td >￥{{payItemTmp.cost?(payItemTmp.cost|number:'1.2-2'):"-"}}</td>
                    </tr>
                    </tbody>
                  </zm-table-detail>
           </zm-card>
            <!--支付收款-->
            
            <!--提成信息-->
           <zm-card *ngIf="viewData.bonusDetailList.length!=0" [header]="'服务提成'">
    
              <zm-table-detail>
                <tbody style="text-align: center">
                    <tr>
                      <td>类型</td>
                      <td>名称</td>
                      <td>支付方式</td>
                      <td>服务人员</td>
                      <td>业绩金额</td>
                      <td>提成方式</td>
                      <td>提成比例</td>
                      <td>提成金额</td>
                    </tr>
                    <tr *ngFor="let item of viewData.bonusDetailList">
                      <td>{{item.buyType | orderItemTypePipeComp}}</td>
                      <td>{{item.pgName?item.pgName:"-"}}</td>
                      <td>{{item.payType|prdCardPayPipe}}</td>
                      <td>
                        <p *ngFor="let userBonus of item.userBonusList">{{userBonus.buserName?userBonus.buserName:"-"}}</p>
                      </td>
                      <td>
                        <p *ngFor="let userBonus of item.userBonusList">￥{{userBonus.amount?(userBonus.amount|number:'1.2-2'):"-"}}</p>
                      </td>
                      <td>
                        <p *ngFor="let userBonus of item.userBonusList">{{userBonus.bonusType|bonusTypePipe}}</p>
                      </td>
                      <td>
                        <p *ngFor="let userBonus of item.userBonusList">{{userBonus.bonusType == 1?userBonus.percentage+'%':'-'}}</p>
                      </td>
                      <td>
                        <p *ngFor="let userBonus of item.userBonusList">￥{{userBonus.cost?(userBonus.cost|number:'1.2-2'):"-"}}</p>
                      </td>
                    </tr>
                </tbody>
              </zm-table-detail>
             
           </zm-card>
            <!--提成信息-->
`,
  styles:[`
`],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class OrderConsumeDetailComp implements OnInit,OnDestroy{

  @Input() orderId:string;
  private viewDataSub: any;
  private service: OrderConsumeDetailCompService;
  public viewData: OrderConsumeDetailCompViewData = new OrderConsumeDetailCompViewData();

  constructor(
              private matDialog:MatDialog,
              private orderViewDataMgr:OrderViewDataMgr,
              private orderDetailMgr:OrderDetailMgr,
              private cdRef: ChangeDetectorRef){
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new OrderConsumeDetailCompService(
     this.orderViewDataMgr,
      this.orderDetailMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.orderViewDataMgr.subscribeOrderConsumeDetailCompVD((viewDataP:OrderConsumeDetailCompViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    if(!AppUtils.isNullObj(this.orderId) && !AppUtils.isNullOrWhiteSpace(this.orderId)){
      this.service.initViewData(this.orderId);
    }
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 跳转详情会员信息
   * @param leaguerId
   */
  goLeaguer(leaguerId):void{
      // AppRouter.goLeaguerDetail(leaguerId);
  }

  lookReason(remark:string){
    const modal = ZmModalMgr.getInstance().newModal(ChargebackReasonComp);
    modal.componentInstance.reason = remark;
  }
}

class OrderConsumeDetailCompService{
  constructor(
              private orderViewDataMgr:OrderViewDataMgr,
              private orderDetailMgr:OrderDetailMgr){}

  public initViewData(orderId):void{
    let viewDataTmp = new OrderConsumeDetailCompViewData();
    this.orderViewDataMgr.setOrderConsumeDetailCompViewData(viewDataTmp);

    this.buildViewData(orderId,(viewData:OrderConsumeDetailCompViewData) =>{
      this.handleViewData(viewData);
    })
  }

  /**
   * 处理回调
   * @param viewData
   */
  public handleViewData(viewData:OrderConsumeDetailCompViewData){
    this.orderViewDataMgr.setOrderConsumeDetailCompViewData(viewData);
  }

  /**
   * 初始化页面数据
   * @param orderId
   * @param callback
   */
  public async buildViewData(orderId,callback:(viewDataP:OrderConsumeDetailCompViewData) => void){
    let viewDataTmp = new OrderConsumeDetailCompViewData();
    let orderDetail:OrderDetail = await this.orderDetailMgr.getOrderDetail(orderId);

    if(orderDetail && orderDetail.simpleOrderInfo){
      viewDataTmp.simpleOrderInfo = orderDetail.simpleOrderInfo;
    }

    if(orderDetail && orderDetail.simpleLeaguerInfo){
      if (!SessionUtil.getInstance().getUserPermData().isPhoneAdmin) {
        orderDetail.simpleLeaguerInfo.phone = AppUtils.replaceLeaguerPhone(orderDetail.simpleLeaguerInfo.phone);
      }
      viewDataTmp.simpleLeaguerInfo = orderDetail.simpleLeaguerInfo;
    }

    if(orderDetail && orderDetail.delimitCardDetails){
      viewDataTmp.delimitCardDetails = orderDetail.delimitCardDetails;
    }

    if(orderDetail && orderDetail.buyDetails){
      viewDataTmp.buyDetails = orderDetail.buyDetails;
      for(let item of orderDetail.buyDetails){
        viewDataTmp.buyDetailsTotalPrice += parseFloat(item.pay.toString());
      }
    }

    if(orderDetail && orderDetail.donateDetails){
      viewDataTmp.donateDetails = orderDetail.donateDetails;
    }

    if(orderDetail && orderDetail.chargeBackDetails){
      viewDataTmp.chargeBackDetails = orderDetail.chargeBackDetails;
      for(let item of orderDetail.chargeBackDetails){
        item.chargeBackItems.forEach((itemTmp)=>{
          if(parseFloat(itemTmp.cost.toString())!=0){
            viewDataTmp.chargeBackTotalAmount += parseFloat(itemTmp.cost.toString());
          }
        });
      }
    }

    if(orderDetail && orderDetail.orderRemark){
      viewDataTmp.orderRemark = orderDetail.orderRemark;
    }

    if(orderDetail && orderDetail.payItems){
      viewDataTmp.payItems = orderDetail.payItems;
    }

    if(orderDetail && orderDetail.orderBonusDetails){
      let bonusDetailList = Array<OrderBonusItem>();
      orderDetail.orderBonusDetails.forEach((item)=>{
        let orderBonusItem = new OrderBonusItem();
        AppUtils.copy(orderBonusItem,item);
        orderBonusItem.userBonusList = this.mapToList(item.userBonusMap);
        bonusDetailList.push(orderBonusItem);
      });
      viewDataTmp.bonusDetailList = bonusDetailList;
    }


    callback(viewDataTmp);
  }

  private mapToList(userBonusMap){
    let userBonusList = new Array<UserBonusDetail>();
    for(let key in userBonusMap){
      let item = userBonusMap[key];
      let userBonus = new UserBonusDetail();
      AppUtils.copy(userBonus,item);
      userBonusList.push(userBonus);
    }
    return userBonusList;
  }


}

export class OrderConsumeDetailCompViewData{
  public orderDetail: OrderDetail = new OrderDetail();

  public simpleOrderInfo:SimpleOrderInfo = new SimpleOrderInfo();

  public simpleLeaguerInfo:SimpleLeaguerInfo = new SimpleLeaguerInfo();

  public delimitCardDetails:Array<DelimitCardDetail> = new Array<DelimitCardDetail>();

  public buyDetails:Array<BuyDetail> = new Array<BuyDetail>();
  public buyDetailsTotalPrice:number = 0;

  public donateDetails:Array<DonateDetail> = new Array<DonateDetail>();

  public chargeBackDetails:Array<ChargeBackDetail> = new Array<ChargeBackDetail>();
  public chargeBackTotalAmount:number = 0;

  public orderRemark:OrderRemark = new OrderRemark();

  public payItems:Array<PayItem> = new Array<PayItem>();

  public bonusDetailList: Array<OrderBonusItem> = new Array<OrderBonusItem>();

}

class OrderBonusItem{
  bonusId:string;
  buyType:number;
  pgId:string;
  pgName:string;
  payType:number;
  payName:string;
  leaguerPrdCardId:string;
  userBonusList:Array<UserBonusDetail>;
}
