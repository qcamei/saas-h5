import {
  Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output,
  EventEmitter
} from "@angular/core";
import {LeaguerRecordMgr} from "../../../../bsModule/leaguerRecord/LeaguerRecordMgr";
import {StoreLeaguerInfoViewDataMgr} from "../../StoreLeaguerInfoViewDataMgr";
import {LeaguerRecordAddForm} from "../../../../bsModule/leaguerRecord/apiData/LeaguerRecordAddForm";
import {LeaguerRecord} from "../../../../bsModule/leaguerRecord/data/LeaguerRecord";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {AppCfg} from "../../../../comModule/AppCfg";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import { RelateProductPopup } from "../../comp/relateProductPopup/relateProductPopup";
import {RelateOrderPopup} from "../../comp/relateOrderPopup/relateOrderPopup";
import {SimpleOrderItem} from "../../comp/relateOrderPopup/relateOrderViewData";
import {Order} from "../../../../bsModule/order/data/Order";
import {OrderSynDataHolder} from "../../../../bsModule/order/OrderSynDataHolder";
import {StoreClerkInfoSynDataHolder} from "../../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {BUserMgr} from "../../../../bsModule/buser/BUserMgr";
import {StoreClerkInfo} from "../../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {BUser} from "../../../../bsModule/buser/apiData/BUser";
import {SimpleProductItem} from "../../comp/relateProductPopup/simpleProductItem";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";

/**
 * 添加会员跟进记录 组件 *ngIf="editRelate"
 */
@Component({
  selector:'add-record-comp',
  template:`
        <zm-card-box [withCollapse]="false">
              <header  fxLayout="row" fxLayoutGap="20px" *ngIf="orderId">
                  <div fxLayout="row">
                    <div class="gl_product">关联订单：</div>
                    <span *ngIf="viewData.selectedOrder" class=" rel_order">{{viewData.selectedOrder.content}}</span>
                  </div>
                  <div fxLayout="row" >
                        <div  class="gl_product">关联项目：</div>
                        <span class="order_blue" *ngFor="let item of viewData.selectedProductList| slice:0:3" style="margin-right:5px;">{{item.pgName}}</span>
                        <b *ngIf="viewData.selectedProductList&&viewData.selectedProductList.length>3" style="margin-left:-6px;">....</b>
                        <div *ngIf="viewData.selectedProductList&&viewData.selectedProductList.length>0" style="padding-left:10px;  cursor: pointer"><i class="fa fa-close" (click)="clearProducts()"></i></div>
      
                      <!-- 添加按钮 -->
                      <div style="color:#666666;padding:0 5px; cursor: pointer;font-size:14px;"(click)="selectProduct()"><img style="width:40%;" src="assets/images/icon/icon_Add.png">添加</div>
                  </div>
              </header>
              <content>
                <div style="width: 400px">
                       <!--<zm-input-text label="标题" [placeholder]="'请输入标题，限50字'" [required]="true"  [(zmValue)]="viewData.addForm.title" [(zmPass)]="viewData.addForm.titlePass" ></zm-input-text>-->
                       <zm-input-textarea [label]="'内容'" [placeholder]="'请输入内容，限500字'" [maxlength]="500" [(text)]="viewData.addForm.content"></zm-input-textarea>
                </div>
                
                <div class="example-container c-input-group mg-t-20">
                  <label class="c-label  mg-t-30">图片</label>
                  <div class="pd-t-10 w-50-p" fxLayout="row">
                    <zm-img-record [(imgArr)]="viewData.addForm.imgPaths"></zm-img-record>
                    <div style="width:100px;">  
                       <zm-input-file *ngIf="viewData.addForm.imgPaths.length<9" [AppearanceButton]="false" [maxCount]="9" [limitCount]="getLimitCount()" [requestUrl]="viewData.requestUrl" [appendKey]="'imgs'" (callback)="setImgUrl($event)"></zm-input-file>
                    </div>
                  </div>
                </div>
                  
                <div fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px" style="margin-top:30px;">
                 <zm-btn-md [stroked]="true" name="取消" (zmbtnClick)="cancel()"></zm-btn-md> 
                    <zm-btn-md name="保存" (zmbtnClick)="addLeaguerRecord()"></zm-btn-md>
                </div>
            </content>
        </zm-card-box>
`,
  styles:[`

.fz-18{
  font-size:18px;
}
.font-bold{
  font-weight:bold;
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
.mg-lr-10{
  margin-left:10px;
  margin-right:10px;
}
.pd-t-10{
  padding-top: 10px;
}
.pd-lr-80{
  padding-left:80px;
  padding-right:80px;
}
.pd-lr-30{
  padding-left:30px;
  padding-right: 30px;
}
.c-label {
  vertical-align: middle;
  margin-right: 10px;
  margin-bottom: 0;
  width: 100px;
  text-align: right;
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
  color:#666666;
  padding-left:20px;
  line-height: 24px;
  background:url(assets/images/order_relevance.png) no-repeat 0% 3px;

}


.order_relevance{
  padding:20px 0 20px 110px;
  width:75%;
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


.rel_product span i{
  position: absolute;
  right:5px;top:0;
  width:21px;
  height:21px;
  cursor: pointer;
}
.rel_order{
  color:#999999;
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
  width:40%;
}
.order_rel2{
  width:60%;
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
export class AddRecordComp implements OnInit,OnDestroy {

  @Input() leaguerId:string;
  @Input() orderId:string;
  @Input() workFlowDataId:string;
  @Input() editRelate:boolean = true;//是否可编辑关联订单关联项目
  @Output() callback:EventEmitter<any> = new EventEmitter<any>();
  private viewDataSub:any;
  private service:AddRecordCompService;
  public viewData:AddRecordCompViewData;

  constructor(
    private matDialog: MatDialog,
    private leaguerRecordMgr:LeaguerRecordMgr,
    private orderSynDataHolder:OrderSynDataHolder,
    private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
    private buserMgr:BUserMgr,
    private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,
    private cdRef:ChangeDetectorRef) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new AddRecordCompService(this.leaguerRecordMgr,
      this.orderSynDataHolder,
      this.storeClerkInfoSynDataHolder,
      this.buserMgr,
      this.storeLeaguerInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeLeaguerInfoViewDataMgr.subscribeAddRecordCompVD((viewDataP:AddRecordCompViewData)=>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    if(!AppUtils.isNullObj(this.leaguerId) && !AppUtils.isNullOrWhiteSpace(this.leaguerId)){
      this.service.initViewData(this.leaguerId,this.orderId);
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
      const activeModal = ZmModalMgr.getInstance().newModal(RelateProductPopup,null,null);
      activeModal.componentInstance.data = this.viewData.selectedOrder;
      activeModal.componentInstance.selectedProductList = this.viewData.selectedProductList;
      activeModal.componentInstance.action = (selectedProductList:Array<SimpleProductItem>)=>{
        this.viewData.selectedProductList = selectedProductList;
        this.storeLeaguerInfoViewDataMgr.setAddRecordCompViewData(this.viewData);
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
    activeModal.componentInstance.leaguerId = this.viewData.addForm.leaguerId;
    activeModal.componentInstance.orderId = this.viewData.selectedOrder?this.viewData.selectedOrder.id:undefined;
    activeModal.componentInstance.action = (item:SimpleOrderItem)=>{
      if(this.viewData.selectedOrder && (item.id != this.viewData.selectedOrder.id)){
        this.clearProducts();
      }
      this.viewData.selectedOrder = item;
      this.storeLeaguerInfoViewDataMgr.setAddRecordCompViewData(this.viewData);
    };
  }

  cancel(){
    this.callback.emit();
  }

  /**
   * 点击事件 添加跟进记录
   */
  addLeaguerRecord(){
    let addForm = this.viewData.addForm;
    // if(AppUtils.isNullObj(addForm.title) || (!AppUtils.isNullObj(addForm.title) && AppUtils.isNullOrWhiteSpace(addForm.title))){
    //   AppUtils.showWarn("提示","标题不能为空");
    // }else
    if((AppUtils.isNullObj(addForm.content) || (!AppUtils.isNullObj(addForm.content) && AppUtils.isNullOrWhiteSpace(addForm.content)))
      && (addForm.imgPaths.length == 0)){
      AppUtils.showWarn("提示","内容和图片不能同时为空");
    }else{
      if(!AppUtils.isNullObj(this.viewData.selectedOrder)){
        addForm.orderId = this.viewData.selectedOrder.id;
        addForm.orderContent = this.viewData.selectedOrder.content;
      }
      if(!AppUtils.isNullObj(this.viewData.selectedProductList) && (this.viewData.selectedProductList.length > 0)){
        addForm.prdIds = this.viewData.selectedProductList.map((item:SimpleProductItem)=>{
          return item.pgId;
        });
      }else{
        addForm.prdIds = [];
      }
      addForm.title = AppUtils.trimBlank(addForm.title);
      addForm.workFlowDataId = this.workFlowDataId;
      this.service.addLeaguerRecord(addForm).then((leaguerRecord:LeaguerRecord)=>{
        if(!AppUtils.isNullObj(leaguerRecord)){
          AppUtils.showSuccess("提示","添加成功");
          this.callback.emit();
        }else{
          AppUtils.showError("提示","添加失败");
        }
      })
    }
  }

  /**
   * 获取可上传图片数量
   * @returns {number}
   */
  getLimitCount():number{
    return 9-this.viewData.addForm.imgPaths.length;
  }

  /**
   * 上传图片回调
   * @param imgArr
   */
  setImgUrl(imgArr: Array<string>) {
    if (imgArr && (imgArr.length > 0) && (this.viewData.addForm.imgPaths.length <= 9)){
      imgArr.forEach((item:string)=>{
        this.viewData.addForm.imgPaths.push(item);
      })
    }
  }

}

export class AddRecordCompService{
  constructor(private leaguerRecordMgr:LeaguerRecordMgr,
              private orderSynDataHolder:OrderSynDataHolder,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,){}

  public async initViewData(leaguerId:string,orderId:string){
    let viewDataTmp = new AddRecordCompViewData();
    viewDataTmp.addForm.leaguerId = leaguerId;
    this.storeLeaguerInfoViewDataMgr.setAddRecordCompViewData(viewDataTmp);

    if(!AppUtils.isNullObj(orderId)){
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
    this.storeLeaguerInfoViewDataMgr.setAddRecordCompViewData(viewDataTmp);
  }

  /**
   * 添加跟进记录
   * @param addForm
   * @returns {Promise<LeaguerRecord>}
   */
  public addLeaguerRecord(addForm:LeaguerRecordAddForm):Promise<LeaguerRecord>{
    return this.leaguerRecordMgr.addLeaguerRecord(addForm);
  }

}

export class AddRecordCompViewData{
  public selectedProductList:Array<SimpleProductItem>;
  public selectedOrder: SimpleOrderItem;
  public addForm:LeaguerRecordAddForm = new LeaguerRecordAddForm()
  public requestUrl:string = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/leaguerRecord/" + SessionUtil.getInstance().getStoreId();
  constructor(){
    this.addForm.imgPaths = new Array<string>();
  }
}
