import {Component, OnInit, Input, Output, Inject} from '@angular/core';
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {OrderMgr} from "../../../../bsModule/order/OrderMgr";
import {PageResp} from "../../../../comModule/PageResp";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {OrderTypeEnum} from "../../../../bsModule/order/data/OrderTypeEnum";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreGoodsSynDataHolder} from "../../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StorePackageProjectSynDataHolder} from "../../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StoreClerkInfoSynDataHolder} from "../../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {BUserMgr} from "../../../../bsModule/buser/BUserMgr";
import {StoreClerkInfo} from "../../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {BUser} from "../../../../bsModule/buser/apiData/BUser";
import {SimpleOrderItem, RelateOrderViewData} from "./relateOrderViewData";
import {Order} from "../../../../bsModule/order/data/Order";
import {Constants} from "../../../common/Util/Constants";
import {MAT_DIALOG_DATA} from "@angular/material";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreGoods} from "../../../../bsModule/storeGoods/data/StoreGoods";
import {StorePackageProject} from "../../../../bsModule/storePackageProject/data/StorePackageProject";
import {StoreCardInfo} from "../../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {SimpleBuyItem} from "./simpleBuyItem";
import {BuyTypeEnum} from "../../../../bsModule/order/data/BuyTypeEnum";

/**
 * 跟进记录选择订单
 */
@Component({
  selector: 'relate-order-popup',
  templateUrl: 'relateOrderPopup.html',
  styleUrls: ['relateOrderPopup.scss']
})
export class RelateOrderPopup implements OnInit {

  @Input() leaguerId:string;
  @Input() orderId:string;
  @Output() action:any;

  private service:RelateOrderService;
  public viewData:RelateOrderViewData;

  private activeModal;
  constructor(
    private orderMgr:OrderMgr,
    private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
    private buserMgr:BUserMgr,
    private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
    private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
    private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
    private storePackageSynDataHolder:StorePackageProjectSynDataHolder,
    @Inject(MAT_DIALOG_DATA) public dataInput:any) {

    this.activeModal = dataInput.modalCtrl;
    this.service = new RelateOrderService(this.orderMgr,
      this.storeClerkInfoSynDataHolder,
      this.buserMgr,
      this.storeProductInfoSynDataHolder,
      this.storeGoodsSynDataHolder,
      this.storeCardInfoSynDataHolder,
      this.storePackageSynDataHolder);
    this.viewData = new RelateOrderViewData();
  }

  ngOnInit() {
    if(!AppUtils.isNullObj(this.leaguerId) && !AppUtils.isNullOrWhiteSpace(this.leaguerId)){
      this.service.initViewData(this.leaguerId,(viewDataP:RelateOrderViewData)=>{
        this.viewData = viewDataP;
        if(!AppUtils.isNullObj(this.orderId) && !AppUtils.isNullOrWhiteSpace(this.orderId)){
          for(let i=0;i<this.viewData.orderList.length;i++){
            let item = this.viewData.orderList[i];
            if(item.id == this.orderId){
              item.isSelected = true;
              this.viewData.selectedOrder = item;
              break;
            }
          }
        }
      })
    }
  }

  /**
   * 选择订单
   * @param itemP
   */
  selectItem(itemP:SimpleOrderItem){
    if(itemP.isSelected){
      this.viewData.selectedOrder = itemP;
      this.viewData.orderList.forEach((item:SimpleOrderItem)=>{
        if(item != itemP){
          item.isSelected = false;
        }
      })
    }else{
      this.viewData.selectedOrder = undefined;
    }
  }

  /**
   * 关闭弹框
   */
  closeModal() {
    this.activeModal.close();
  }

  /**
   * 确定
   */
  confirm(){
    if(!AppUtils.isNullObj(this.viewData.selectedOrder)){
      this.action(this.viewData.selectedOrder);
      this.activeModal.close();
    }else{
      AppUtils.showWarn("提示","请选择关联订单");
    }
  }

  /**
   * 下一步
   */
  next(){
    if(!AppUtils.isNullObj(this.viewData.selectedOrder)){
      this.action(this.viewData.selectedOrder);
      this.activeModal.close();
    }else{
      AppUtils.showWarn("提示","请选择关联订单");
    }
  }

  /**
   * 取消
   */
  cancel(){
    this.activeModal.close();
  }

  /**
   * 查看详情
   * @param item
   */
  goDetail(item:SimpleOrderItem){
    console.log("goDetail=========")
    this.viewData.selectedSimpleOrderItem = item;
    this.viewData.showPageIndex = 1;
    // const activeModal = this.modalService.open(SimpleOrderDetailPopup, {size: 'lg',backdrop:'static'});
    // activeModal.componentInstance.data = item;
  }

  /**
   * 隐藏详情 显示列表
   */
  hideDetail(){
    this.viewData.selectedSimpleOrderItem = undefined;
    this.viewData.showPageIndex = 0;
  }

  /**
   * 组装显示数据
   * @returns {Promise<Array<SimpleBuyItem>>}
   */
  getDetailData(simpleOrderItem:SimpleOrderItem):Array<SimpleBuyItem>{
    let buyItems = new Array<SimpleBuyItem>();
    if(!AppUtils.isNullObj(simpleOrderItem.delimitCardItems)){//划卡项
      simpleOrderItem.delimitCardItems.forEach((item)=>{
        buyItems.push(SimpleBuyItem.fromDelimitCarditem(item));
      })
    }
    if(!AppUtils.isNullObj(simpleOrderItem.buyItems)){//购买项
      simpleOrderItem.buyItems.forEach((item)=>{
        buyItems.push(SimpleBuyItem.fromBuyItem(item));
      })
    }
    if(!AppUtils.isNullObj(simpleOrderItem.donationItems)){//赠送项
      simpleOrderItem.donationItems.forEach((item)=>{
        buyItems.push(SimpleBuyItem.fromDonationItem(item));
      })
    }

    for(let i=0;i<buyItems.length;i++){
      let buyItem = buyItems[i];
      if(buyItem.buyType == BuyTypeEnum.PRODUCT){
        buyItem.pgName = this.viewData.productMap.get(buyItem.pgId)?this.viewData.productMap.get(buyItem.pgId).name:'-';
      }else if(buyItem.buyType == BuyTypeEnum.GOODS){
        buyItem.pgName = this.viewData.goodsMap.get(buyItem.pgId)?this.viewData.goodsMap.get(buyItem.pgId).name:'-';
      }else if(buyItem.buyType == BuyTypeEnum.PACKAGE){
        buyItem.pgName = this.viewData.packageMap.get(buyItem.pgId)?this.viewData.packageMap.get(buyItem.pgId).name:'-';
      }else if(buyItem.buyType == BuyTypeEnum.PRDCARD){
        buyItem.pgName = this.viewData.cardMap.get(buyItem.pgId)?this.viewData.cardMap.get(buyItem.pgId).name:'-';
      }
    }
    return buyItems;
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    this.service.getPageData(curPage,this.viewData,()=>{
      if(!AppUtils.isNullObj(this.orderId) && !AppUtils.isNullOrWhiteSpace(this.orderId)){
        for(let i=0;i<this.viewData.orderList.length;i++){
          let item = this.viewData.orderList[i];
          if(item.id == this.orderId){
            item.isSelected = true;
            this.viewData.selectedOrder = item;
            break;
          }
        }
      }
    });
  }

}

export class RelateOrderService{
  constructor(private orderMgr:OrderMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private storePackageSynDataHolder:StorePackageProjectSynDataHolder){}

  public async initViewData(leaguerId,callback:(viewData:RelateOrderViewData)=>void){
    let viewDataTmp = new RelateOrderViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    viewDataTmp.orderQueryForm.storeId = storeId;
    viewDataTmp.orderQueryForm.leaguerId = leaguerId;
    viewDataTmp.orderQueryForm.orderType = OrderTypeEnum.PURCHASE;
    let pageResp:PageResp = await this.orderMgr.findOrderPageInfo(viewDataTmp.orderQueryForm);
    if(!AppUtils.isNullObj(pageResp)){
      if(pageResp.totalCount > 0){
        //获取跟进人员数据
        let storeClerkInfo:StoreClerkInfo = await this.storeClerkInfoSynDataHolder.getData(SessionUtil.getInstance().getIdByStoreId(storeId));
        if(!AppUtils.isNullObj(storeClerkInfo) && storeClerkInfo.getClerkMap().keys().length > 0){
          let buserList:Array<BUser> = await this.buserMgr.findByMultitId(storeClerkInfo.getClerkMap().keys());
          viewDataTmp.buserMap = this.buildBuserMap(buserList);
        }

        //订单详情显示数据
        let storeProductInfo:StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
        viewDataTmp.productMap = storeProductInfo?storeProductInfo.getAllProductInfoMap():viewDataTmp.productMap;
        let storeGoods:StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
        viewDataTmp.goodsMap = storeGoods?storeGoods.getAllGoodsMap():viewDataTmp.goodsMap;
        let storePackageProject:StorePackageProject = await this.storePackageSynDataHolder.getData(storeId);
        viewDataTmp.packageMap = storePackageProject?storePackageProject.getAllPackageProjectMap():viewDataTmp.packageMap;
        let storeCardInfo:StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
        viewDataTmp.cardMap = storeCardInfo?storeCardInfo.getProductCardMap():viewDataTmp.cardMap;
      }
      viewDataTmp.orderList = this.buildListData(pageResp.list,viewDataTmp.buserMap);
      viewDataTmp.curPage = Constants.DEFAULT_PAGENO;
      viewDataTmp.recordCount = pageResp.totalCount;
    }

    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   */
  public async getPageData(curPage, viewData: RelateOrderViewData, callback:()=>void) {
    //清空数据
    viewData.recordCount = 0;
    viewData.loadingFinish = false;
    viewData.orderList = [];
    viewData.orderQueryForm.pageNo = curPage;
    let pageResp:PageResp = await this.orderMgr.findOrderPageInfo(viewData.orderQueryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewData.orderList = this.buildListData(pageResp.list,viewData.buserMap);
      viewData.curPage = curPage;
      viewData.recordCount = pageResp.totalCount;
    }
    viewData.loadingFinish = true;
    callback();
  }

  /**
   * 组装员工详情
   * @param buserList
   */
  private buildBuserMap(buserList: Array<BUser>):ZmMap<BUser> {
    let buserMap = new ZmMap<BUser>();
    for (let i = 0; i < buserList.length; i++) {
      buserMap.put(buserList[i].id, buserList[i]);
    }
    return buserMap;
  }

  /**
   * 组装显示订单列表
   * @param orders
   * @param buserMap
   * @returns {SimpleOrderItem[]}
   */
  private buildListData(orders:Array<Order>,buserMap:ZmMap<BUser>):Array<SimpleOrderItem>{
    let orderList = new Array<SimpleOrderItem>();
    for(let i=0;i<orders.length;i++){
      let order:Order = orders[i];
      let simpleOrderItem = SimpleOrderItem.fromOrder(order);
      simpleOrderItem.creatorName = buserMap.get(order.creatorId)?buserMap.get(order.creatorId).name:"-";
      simpleOrderItem.content = order.number;
      orderList.push(simpleOrderItem);
    }
    orderList.sort((a:SimpleOrderItem,b:SimpleOrderItem)=>{
      return b.createdTime - a.createdTime;
    })
    return orderList;
  }

}


