import {
  Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output,
  EventEmitter, Inject
} from "@angular/core";
import {LeaguerRecordMgr} from "../../../../bsModule/leaguerRecord/LeaguerRecordMgr";
import {StoreLeaguerInfoViewDataMgr} from "../../StoreLeaguerInfoViewDataMgr";
import {LeaguerRecord} from "../../../../bsModule/leaguerRecord/data/LeaguerRecord";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {LeaguerRecordUpdateForm} from "../../../../bsModule/leaguerRecord/apiData/LeaguerRecordUpdateForm";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {AppCfg} from "../../../../comModule/AppCfg";
import {RestResp} from "../../../../comModule/RestResp";
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
import {SimpleProductItem} from "../../comp/relateProductPopup/simpleProductItem";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";

/**
 * 编辑会员跟进记录公共组件
 */
@Component({
  selector:'edit-record-comp',
  template:`
           <zm-card-box [withCollapse]="false">
              
                  <header fxLayout="row" fxLayoutGap="60px" *ngIf="orderId">
                    <div fxLayout="row" fxLayoutGap="5px">
                      <div  class="gl_product">关联订单：</div>
                      <span *ngIf="viewData.selectedOrder" class="order_blue rel_order">{{viewData.selectedOrder.content}}</span>
                    </div>
              
                    <div fxLayout="row" fxLayoutGap="5px">
                      <div  class="gl_product">关联项目：</div>
                      <div class="order_blue rel_product disFlex flex">
                        <span class="content" *ngFor="let selectProduct of viewData.selectedProductList|slice:0:3">{{selectProduct.pgName}}</span>
                        <b *ngIf="viewData.selectedProductList&&viewData.selectedProductList.length>3" style="margin-left:-6px;">....</b>
                        <span *ngIf="viewData.selectedProductList&&viewData.selectedProductList.length>0" class="order_blue rel_order" style="width:30px;"><i class="fa fa-close" (click)="clearProducts()"></i></span>
              
                        <!-- 添加按钮 -->
                        <div style="padding:0 5px; cursor: pointer;font-size:14px;"(click)="selectProduct()"><img style="width:40%;" src="assets/images/icon/icon_Add.png">添加</div>
                      </div>
                    </div>
                  </header>
                  
                  <content>
                      <!--<zm-input-name [label]="'标题'" [placeholder]="'请输入标题'" style="max-width: 250px" [(zmValue)]="viewData.updateForm.title" [(zmPass)]="viewData.updateForm.titlePass" ></zm-input-name>-->
                      <zm-input-textarea [label]="'内容'" [placeholder]="'请输入内容，限500字'" [maxlength]="500" [(text)]="viewData.updateForm.content"></zm-input-textarea>
                  
                      <div class="example-container c-input-group mg-t-20">
                        <label class="c-label  mg-t-30">图片</label>
                        <div class="pd-t-10" fxLayout="row">
                          <zm-img-record [(imgArr)]="viewData.updateForm.imgPaths"></zm-img-record>
                          <div style="width:100px;">
                            <zm-input-file *ngIf="viewData.updateForm.imgPaths.length<9" [AppearanceButton]="false" [maxCount]="9" [limitCount]="getLimitCount()" [requestUrl]="viewData.requestUrl" [appendKey]="'imgs'" (callback)="setImgUrl($event)"></zm-input-file>
                          </div>
                        </div>
                      </div>
                      <div fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px" style="margin-top: 20px;margin-bottom: 20px;">
                          <zm-btn-md [stroked]="true" name="取消" (zmbtnClick)="cancel()"></zm-btn-md>
                          <zm-btn-md name="保存" (zmbtnClick)="updateLeaguerRecord()"></zm-btn-md>
                      </div>
                  </content>
           </zm-card-box>
`,
  styles:[`
.btn{
  padding: 0.75rem 0.35rem;
}
.c-input-group{
  align-items: center !important;
  .form-control{
    border-radius: 0.375rem !important;
  }
}
.form-control{
  padding: 0.75rem 0.75rem;
  border: 2px solid #ced4da;
}
.form-control:focus{
  box-shadow: none;
}
.font-c3{
  color: #FF4c6a;
}
.c-btn-blue{
  color: #fff;
  border-color: #4678fa !important;
  background-color: #4678fa !important;
}
.cur-hand{
  cursor: pointer;
}
.mg-b-30{
  margin-bottom:30px;
}
.mg-t-20{
  margin-top:20px;
}
.mg-t-30{
  margin-top:30px;
}
.pd-t-10{
  padding-top: 10px;
}
.pd-lr-80{
  padding-left:80px;
  padding-right:80px;
}

.c-label {
  vertical-align: middle;
  margin-right: 10px;
  margin-bottom: 0;
  width: 100px;
  text-align: right;
}

.c-input-error{
  height: 30px;
  padding-left: 110px;
  color: #FF4c6a;
  font-size: 12px;
}

.btn-upload{
  border: none;
  outline: none;
  width:86px;
  height:32px;
  background:rgba(69,119,248,1);
  border-radius: 6px;
  margin-top: 19px;
}
.input-upload {
  opacity: 0;
  filter: alpha(opacity=0);
  top:0px;
  left:0;
  width: 86px;
  height:32px;
}

button{
  margin-left:110px;
}

.c-input-group{
  width:1190px;
}



.gl_product{
  padding-left:20px;
  background:url(assets/images/order_relevance.png) no-repeat 0% 3px;

}


.order_relevance{
  padding-left:110px;
  padding-bottom:20px;
  width:90%;
}

.order_blue{
  color:#4678FA;
}

.rel_product span{
  display: inline-block;
  overflow: hidden;
  max-width: 140px;
  height:24px;
  position: relative;
  font-size: 14px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.rel_product .content{
  padding-right: 10px;
}

.rel_product span i{
  position: absolute;
  right:5px;top:0;
  width:21px;
  height:21px;
  cursor: pointer;
}
.rel_order{
  //padding-right:30px;
  position: relative;
  font-size: 14px;
}
.rel_order i{
  position: absolute;
  right:5px;top:2px;
  width:21px;
  height:21px;
  cursor: pointer;
}

.order_rel{
  width:50%;
}
.order_rel2{
  width:50%;
}
.disFlex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: -moz-box;
  display: flex;
}
.flex {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  -webkit-flex: 1;
  -moz-box-flex: 1;
  flex: 1;
}

.ul_img{
flex-wrap:wrap;
}
.ul_img li{

width:100px;
height:100px;
margin-right:5px;
margin-top:5px;
}
.ul_img li img{
width:100%;
height:100%;
}

`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditRecordComp implements OnInit,OnDestroy {

  @Input() leaguerRecordId:string;
  @Input() orderId:string;
  @Output() callback:EventEmitter<any> = new EventEmitter<any>();
  private viewDataSub:any;
  private service:EditRecordService;
  public viewData:EditRecordViewData;

  constructor(
              private matDialog: MatDialog,
              private leaguerRecordMgr:LeaguerRecordMgr,
              private orderSynDataHolder:OrderSynDataHolder,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,
              private cdRef:ChangeDetectorRef) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new EditRecordService(this.leaguerRecordMgr,
      this.orderSynDataHolder,
      this.storeClerkInfoSynDataHolder,
      this.buserMgr,
      this.storeProductInfoSynDataHolder,
      this.storeLeaguerInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeLeaguerInfoViewDataMgr.subscribeEditRecordVD((viewDataP:EditRecordViewData)=>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })

    if(!AppUtils.isNullOrWhiteSpace(this.leaguerRecordId)){
      this.service.initViewData(this.leaguerRecordId,this.orderId);
    }
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
    this.viewData.relatePrdArr = undefined;
    this.viewData.selectedProductList = undefined;
  }

  /**
   * 删除项目
   */
  clearProducts(){
    this.viewData.relatePrdArr = undefined;
    this.viewData.selectedProductList = undefined;
  }


  /**
   * 选择关联项目
   */
  selectProduct(){
    if(!AppUtils.isNullObj(this.viewData.selectedOrder)){
      const activeModal = ZmModalMgr.getInstance().newModal(RelateProductPopup,null,null);
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
    const activeModal = ZmModalMgr.getInstance().newModal(RelateOrderPopup,null,null);
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

  cancel(){
    this.callback.emit();
  }

  /**
   * 修改跟进记录
   */
  updateLeaguerRecord(){
    let updateForm = this.viewData.updateForm;
    // if(AppUtils.isNullObj(updateForm.title) || (!AppUtils.isNullObj(updateForm.title) && AppUtils.isNullOrWhiteSpace(updateForm.title))){
    //   AppUtils.showWarn("提示","标题不能为空");
    // }else
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
          this.callback.emit();
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
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,){}

  public initViewData(leaguerRecordId:string,orderId:string){
    let viewDataTmp = new EditRecordViewData();
    this.storeLeaguerInfoViewDataMgr.setEditRecordViewData(viewDataTmp);
    this.buildViewData(leaguerRecordId,orderId,(viewData:EditRecordViewData)=>{
      this.storeLeaguerInfoViewDataMgr.setEditRecordViewData(viewData);
    })
  }

  private async buildViewData(leaguerRecordId:string,orderIdP:string,callback:(viewData:EditRecordViewData)=>void){
    let viewDataTmp = new EditRecordViewData();
    let leaguerRecord:LeaguerRecord = await this.leaguerRecordMgr.get(leaguerRecordId)
    if(!AppUtils.isNullObj(leaguerRecord)){
      viewDataTmp.leaguerRecord = leaguerRecord;
      viewDataTmp.updateForm.title = leaguerRecord.title;
      viewDataTmp.updateForm.content = leaguerRecord.content;
      viewDataTmp.updateForm.imgPaths = leaguerRecord.imgPaths?leaguerRecord.imgPaths:[];
      //有关联订单
      let orderId:string;
      if(!AppUtils.isNullObj(leaguerRecord.relateOrder) && !AppUtils.isNullObj(leaguerRecord.relateOrder.orderId)
        && AppUtils.isPositiveInteger(leaguerRecord.relateOrder.orderId)){
        orderId = leaguerRecord.relateOrder.orderId;
      }else{
        orderId = orderIdP;
      }
      if(!AppUtils.isNullObj(orderId) && !AppUtils.isNullOrWhiteSpace(orderId) && AppUtils.isPositiveInteger(orderId)){
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
        let order:Order = await this.orderSynDataHolder.getData(orderId);
        if(!AppUtils.isNullObj(order)){
          let simpleOrderItem = SimpleOrderItem.fromOrder(order);
          simpleOrderItem.creatorName = buserMap.get(order.creatorId)?buserMap.get(order.creatorId).name:"-";
          simpleOrderItem.content = order.number;
          viewDataTmp.selectedOrder = simpleOrderItem;
        }
      }
      //有关联项目
      if (!AppUtils.isNullObj(viewDataTmp.selectedOrder) && !AppUtils.isNullObj(leaguerRecord.relateProduct)
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
              // viewDataTmp.relatePrdArr.push(productInfo.name);
            }
          })
        }
      }
    }else{
      AppUtils.showError("提示","加载失败");
    }
    callback(viewDataTmp);
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
  public relatePrdArr = new Array<string>();
  public selectedProductList:Array<SimpleProductItem>;
  public selectedOrder: SimpleOrderItem;
  public leaguerRecord:LeaguerRecord;
  public updateForm:LeaguerRecordUpdateForm = new LeaguerRecordUpdateForm();
  public requestUrl:string = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/leaguerRecord/" + SessionUtil.getInstance().getStoreId();
  constructor(){
    this.updateForm.imgPaths = new Array<string>();
  }
}
