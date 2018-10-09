import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {LeaguerRecordMgr} from "../../../../bsModule/leaguerRecord/LeaguerRecordMgr";
import {StoreLeaguerInfoViewDataMgr} from "../../StoreLeaguerInfoViewDataMgr";
import {ActivatedRoute} from "@angular/router";
import {LeaguerRecord} from "../../../../bsModule/leaguerRecord/data/LeaguerRecord";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {LeaguerRecordUpdateForm} from "../../../../bsModule/leaguerRecord/apiData/LeaguerRecordUpdateForm";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {AppCfg} from "../../../../comModule/AppCfg";
import {RestResp} from "../../../../comModule/RestResp";
import {AppRouter} from "../../../../comModule/AppRouter";
import {LeaguerDetailTabEnum} from "../leaguerDetailTabEnum";
import { RelateProductPopup } from "../../comp/relateProductPopup/relateProductPopup";
import { RelateOrderPopup } from "../../comp/relateOrderPopup/relateOrderPopup";
import {SimpleOrderItem, PgItem} from "../../comp/relateOrderPopup/relateOrderViewData";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {Order} from "../../../../bsModule/order/data/Order";
import {BUser} from "../../../../bsModule/buser/apiData/BUser";
import {StoreClerkInfo} from "../../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {OrderSynDataHolder} from "../../../../bsModule/order/OrderSynDataHolder";
import {StoreClerkInfoSynDataHolder} from "../../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {BUserMgr} from "../../../../bsModule/buser/BUserMgr";
import {StoreGoodsSynDataHolder} from "../../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StorePackageProjectSynDataHolder} from "../../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {SimpleProductItem} from "../../comp/relateProductPopup/simpleProductItem";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";

/**
 * 编辑会员跟进记录
 */
@Component({
  selector:'edit-record',
  templateUrl:'editRecord.html',
  styleUrls:['editRecord.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditRecordPage implements OnInit,OnDestroy {

  private viewDataSub:any;
  private paramSub:any;
  private service:EditRecordService;
  public viewData:EditRecordViewData;

  constructor(
    private leaguerRecordMgr:LeaguerRecordMgr,
    private orderSynDataHolder:OrderSynDataHolder,
    private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
    private buserMgr:BUserMgr,
    private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
    private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
    private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
    private storePackageSynDataHolder:StorePackageProjectSynDataHolder,
    private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,
    private route:ActivatedRoute,
    private cdRef:ChangeDetectorRef,
    matDialog: MatDialog) {

    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new EditRecordService(this.leaguerRecordMgr,
      this.orderSynDataHolder,
      this.storeClerkInfoSynDataHolder,
      this.buserMgr,
      this.storeProductInfoSynDataHolder,
      this.storeGoodsSynDataHolder,
      this.storeCardInfoSynDataHolder,
      this.storePackageSynDataHolder,
      this.storeLeaguerInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeLeaguerInfoViewDataMgr.subscribeEditRecordVD((viewDataP:EditRecordViewData)=>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })

    this.paramSub = this.route.params.subscribe((params)=>{
      let leaguerRecordId = params['leaguerRecordId'];
      this.service.initViewData(leaguerRecordId);
    })
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 删除订单
   */
  clearOrder(){
    this.viewData.selectedOrder = undefined;
    this.viewData.selectedProductList = undefined;
  }

  /**
   * 删除项目
   */
  clearProducts(){
    this.viewData.selectedProductList = undefined;
  }


  /**
   * 选择关联项目
   */
  selectProduct(){
    if(!AppUtils.isNullObj(this.viewData.selectedOrder)){
      const activeModal = ZmModalMgr.getInstance().newModal(RelateProductPopup, null,null);
      activeModal.componentInstance.data = this.viewData.selectedOrder;
      activeModal.componentInstance.selectedProductList = this.viewData.selectedProductList;
      activeModal.componentInstance.action = (selectedProductList:Array<SimpleProductItem>)=>{
        this.viewData.selectedProductList = selectedProductList;
        this.storeLeaguerInfoViewDataMgr.setEditRecordViewData(this.viewData);
      };
    }else{
      AppUtils.showWarn("提示","请先添加关联订单");
    }
  }

  /**
   * 选择关联订单 弹框
   */
  selectOrder(){
    const activeModal = ZmModalMgr.getInstance().newModal(RelateOrderPopup, null,null);
    activeModal.componentInstance.leaguerId = this.viewData.leaguerRecord.leaguerId;
    activeModal.componentInstance.orderId = this.viewData.selectedOrder?this.viewData.selectedOrder.id:undefined;
    activeModal.componentInstance.action = (item:SimpleOrderItem)=>{
      if(this.viewData.selectedOrder && (item.id != this.viewData.selectedOrder.id)){
        this.clearProducts();
      }
      this.viewData.selectedOrder = item;
      this.storeLeaguerInfoViewDataMgr.setEditRecordViewData(this.viewData);
    };
  }

  /**
   * 修改跟进记录
   */
  updateLeaguerRecord(){
    let updateForm = this.viewData.updateForm;
    if((AppUtils.isNullObj(updateForm.content) || (!AppUtils.isNullObj(updateForm.content) && AppUtils.isNullOrWhiteSpace(updateForm.content)))
      && (updateForm.imgPaths.length == 0)){
      AppUtils.showWarn("提示","内容和图片不能同时为空");
    }else{
      if(!AppUtils.isNullObj(this.viewData.selectedOrder)){
        updateForm.orderId = this.viewData.selectedOrder.id;
        updateForm.orderContent = this.viewData.selectedOrder.content;
      }
      if(!AppUtils.isNullObj(this.viewData.selectedProductList) && (this.viewData.selectedProductList.length > 0)){
        updateForm.prdIds = this.viewData.selectedProductList.map((item:SimpleProductItem)=>{
          return item.pgId;
        });
      }else{
        updateForm.prdIds = [];
      }
      this.service.updateLeaguerRecord(this.viewData.leaguerRecord.id,updateForm).then((restResp:RestResp)=>{
        if(restResp.code == 200){
          AppUtils.showSuccess("提示","修改成功");
          AppRouter.goLeaguerDetailByTab(this.viewData.leaguerRecord.leaguerId,LeaguerDetailTabEnum.RECORD);
        }else{
          AppUtils.showError("提示","修改失败");
        }
      })
    }
  }

  /**
   * 获取可上传图片数量
   * @returns {number}
   */
  getLimitCount():number{
    return 9-this.viewData.updateForm.imgPaths.length;
  }

  /**
   * 上传图片回调
   * @param imgArr
   */
  setImgUrl(imgArr: Array<string>) {
    if (imgArr && (imgArr.length > 0) && (this.viewData.updateForm.imgPaths.length <= 9)){
      imgArr.forEach((item:string)=>{
        this.viewData.updateForm.imgPaths.push(item);
      })
    }
  }

}

export class EditRecordService{
  constructor(private leaguerRecordMgr:LeaguerRecordMgr,
              private orderSynDataHolder:OrderSynDataHolder,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private storePackageSynDataHolder:StorePackageProjectSynDataHolder,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,){}

  public initViewData(leaguerRecordId:string){
    let viewDataTmp = new EditRecordViewData();
    this.storeLeaguerInfoViewDataMgr.setEditRecordViewData(viewDataTmp);
    this.buildViewData(leaguerRecordId,(viewData:EditRecordViewData)=>{
      this.storeLeaguerInfoViewDataMgr.setEditRecordViewData(viewData);
    })
  }

  private async buildViewData(leaguerRecordId:string,callback:(viewData:EditRecordViewData)=>void){
    let viewDataTmp = new EditRecordViewData();
    let leaguerRecord:LeaguerRecord = await this.leaguerRecordMgr.get(leaguerRecordId)
    if(!AppUtils.isNullObj(leaguerRecord)){
      viewDataTmp.leaguerRecord = leaguerRecord;
      viewDataTmp.updateForm.title = leaguerRecord.title;
      viewDataTmp.updateForm.content = leaguerRecord.content;
      viewDataTmp.updateForm.imgPaths = leaguerRecord.imgPaths?leaguerRecord.imgPaths:[];
      //有关联订单
      if(!AppUtils.isNullObj(leaguerRecord.relateOrder) && !AppUtils.isNullObj(leaguerRecord.relateOrder.orderId)
        && AppUtils.isPositiveInteger(leaguerRecord.relateOrder.orderId)){
        let storeId = SessionUtil.getInstance().getStoreId();
        let buserMap = new ZmMap<BUser>();
        let storeClerkInfo:StoreClerkInfo = await this.storeClerkInfoSynDataHolder.getData(SessionUtil.getInstance().getIdByStoreId(storeId));
        if(!AppUtils.isNullObj(storeClerkInfo) && storeClerkInfo.getClerkMap().keys().length > 0){
          await this.buserMgr.findByMultitId(storeClerkInfo.getClerkMap().keys()).then((buserList:Array<BUser>)=>{
            buserList.forEach((buser)=>{
              buserMap.put(buser.id,buser);
            })
          })
        }
        let order:Order = await this.orderSynDataHolder.getData(leaguerRecord.relateOrder.orderId);
        if(!AppUtils.isNullObj(order)){
          let simpleOrderItem = SimpleOrderItem.fromOrder(order);
          simpleOrderItem.creatorName = buserMap.get(order.creatorId)?buserMap.get(order.creatorId).name:"-";
          simpleOrderItem.content = order.number;
          viewDataTmp.selectedOrder = simpleOrderItem;
        }
      }
      //有关联项目
      if (!AppUtils.isNullObj(leaguerRecord.relateProduct)
        && !AppUtils.isNullObj(leaguerRecord.relateProduct.prdIds)
        && leaguerRecord.relateProduct.prdIds.length > 0) {
        viewDataTmp.updateForm.prdIds = leaguerRecord.relateProduct.prdIds;
        let storeId = SessionUtil.getInstance().getStoreId();
        let storeProductInfo:StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
        if (!AppUtils.isNullObj(storeProductInfo)) {
          let prdInfoMap = storeProductInfo.getAllProductInfoMap();
          let selectedProductList = new Array<SimpleProductItem>();
          leaguerRecord.relateProduct.prdIds.forEach((id) => {
            let productInfo = prdInfoMap.get(id.toString());
            if (!AppUtils.isNullObj(productInfo)) {
              let simpleProductItem = new SimpleProductItem();
              simpleProductItem.pgId = productInfo.id;
              simpleProductItem.pgName = productInfo.name;
              selectedProductList.push(simpleProductItem);
              viewDataTmp.selectedProductList = selectedProductList;
            }
          })
        }
      }
    }else{
      AppUtils.showError("提示","加载失败");
    }
    callback(viewDataTmp);
  }

  private getPgList(order: Order):Array<PgItem>{
    let pgItemArray = new Array<PgItem>();
    if (!AppUtils.isNullObj(order.delimitCardItems)) {
      order.delimitCardItems.forEach((item) => {
        pgItemArray.push(new PgItem(item.pgId, item.itemType, true));
      })
    }
    if (!AppUtils.isNullObj(order.buyItems)) {
      order.buyItems.forEach((item) => {
        pgItemArray.push(new PgItem(item.pgId, item.buyType));
      })
    }
    if (!AppUtils.isNullObj(order.donationItems)) {
      order.donationItems.forEach((item) => {
        pgItemArray.push(new PgItem(item.pgId, item.buyType));
      })
    }
    return pgItemArray;
  }

  /**
   * 修改跟进记录
   * @param updateForm
   * @returns {Promise<RestResp>}
   */
  public updateLeaguerRecord(leaguerRecordId:string,updateForm:LeaguerRecordUpdateForm):Promise<RestResp>{
    return this.leaguerRecordMgr.updateLeaguerRecord(leaguerRecordId,updateForm);
  }

}

export class EditRecordViewData{
  public selectedProductList:Array<SimpleProductItem>;
  public selectedOrder: SimpleOrderItem;
  public leaguerRecord:LeaguerRecord;
  public updateForm:LeaguerRecordUpdateForm = new LeaguerRecordUpdateForm();
  public requestUrl:string = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/leaguerRecord/" + SessionUtil.getInstance().getStoreId();
  constructor(){
    this.updateForm.imgPaths = new Array<string>();
  }
}
