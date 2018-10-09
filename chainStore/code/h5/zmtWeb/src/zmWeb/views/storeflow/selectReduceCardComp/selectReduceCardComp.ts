import {Component, OnInit, Input, OnChanges, SimpleChanges} from "@angular/core";
import {SelectReduceCardPopup, SelectReduceCardPopupViewData} from "./selectReduceCardPopup/selectReduceCardPopupComp";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {WFDataWraper, ReduceItemData, DelimitCardRecordsWFCompData, ReduceItemType} from "../wfComp/WFDataWraper";
import {WFDataWraperMgr} from "../wfComp/WFDataWraperMgr";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {LeaguerDetailSynDataHolder} from "../../../bsModule/leaguerDetail/LeaguerDetailSynDataHolder";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StorePackageProjectSynDataHolder} from "../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {StorePackageProject} from "../../../bsModule/storePackageProject/data/StorePackageProject";
import {ProductCardItemEnum} from "../../../bsModule/productCardDetail/data/ProductCardItemEnum";
import {ProductCardDetailCacheDataHolder} from "../../../bsModule/productCardDetail/productCardDetailCacheDataHolder";
import {ProductCardDetail} from "../../../bsModule/productCardDetail/data/ProductCardDetail";
import {DelimitCardRecordWFMgr} from "../../../bsModule/workFlow/DelimitCardRecordWFMgr";
import {DelimitCardRecordAddForm} from "../../../bsModule/workFlow/apiData/DelimitCardRecordAddForm";
import {DelimitCardRecordUpdateForm} from "../../../bsModule/workFlow/apiData/DelimitCardRecordUpdateForm";
import {LeaguerPrdCardItem} from "../../../bsModule/storeLeaguerInfo/data/LeaguerPrdCardItem";
import {LeaguerProductCard} from "../../../bsModule/storeLeaguerInfo/data/LeaguerProductCard";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {PreStoreCard} from "../../../bsModule/leaguerDetail/data/PreStoreCard";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StoreCardInfo} from "../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";

/**
 * 选择划卡公共组件
 */
@Component({
  selector:'select-reduce-card-comp',
  template:`
          <zm-card-box [withCollapse]="true" [expanded]="contentExpanded">
          <header fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="56px">
             <label fxLayoutAlign="center center" style="font-weight: bold;font-size: 18px;">划卡/预存</label>
             <div fxLayout="row" fxLayoutAlign="start" fxLayoutGap="20px">
                <div class="zmCurHand"  fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" (click)="selectReduceItem($event)">
                    <img src="assets/images/icon/icon_Add.png" alt="">
                  <span class="color-theme fz-14" style="font-weight:normal;margin-left: 12px" >添加</span>
                </div>
             </div>
           </header>
             <content>
                <zm-table-detail *ngIf="delimitCardRecordsWFCompData.reduceList.length>0" [borderNone]="true">
                <thead>
                  <th style="width:14%;">序号</th>
                  <th style="width:14%;">类型</th>
                  <th style="width:14%;">所属次卡</th>
                  <th style="width:16%;">名称</th>
                  <th style="width:14%;">剩余数量</th>
                  <th style="width:14%;">消费数量</th>
                  <th style="width:14%;">操作</th>
                </thead>
                <tbody style="text-align: center">
                  <tr *ngFor="let item of delimitCardRecordsWFCompData.reduceList;let i=index">
                      <td style="width:14%;">{{i+1}}</td>
                      <td style="width:14%;">{{item.itemType | reduceCardItemTypePipe}}</td>
                      <td style="width:14%;">{{item.productCardName}}</td>
                      <td style="width:16%;">{{item.name}}</td>
                      <td style="width:14%;">
                      <span>{{item.restCount==-1?'无限':item.restCount}}/{{item.totalCount==-1?'无限':item.totalCount}}</span>
                      </td>
                      <td style="width:14%;">
                          <div fxLayout="row" fxLayoutGap="5px">
                            <i class="fa fa-pencil" style="color:#4678fa;padding-top:5px;"></i>
                            <input type="number" oninput="if(value.length>3)value=value.slice(0,3)" style="width:100%;border:none;" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.count" (change)="changeCount($event,item)">
                          </div>
                      </td>
                      <td style="width:14%;color:#4678fa;"><a (click)="deleteItem(i)">删除</a></td>
                  </tr>
                </tbody>
              </zm-table-detail> 
                
              <div class="noData-tips text-center mg-t-30 mg-b-30" *ngIf="delimitCardRecordsWFCompData.reduceList.length==0">
                  <p class="mg-b-0" style="color:#999;">请点击上方进行添加划卡项</p>
              </div>
             </content>
           </zm-card-box>
  `,
  styles:[`
  `]
})
export class SelectReduceCardComp implements OnInit,OnChanges{

  private service: SelectReduceCardService;
  public viewData: SelectReduceCardViewData;
  //输入参数
  @Input() wFDataWraper:WFDataWraper;
  @Input() leaguerId:string;

  public delimitCardRecordsWFCompData:DelimitCardRecordsWFCompData;
  public contentExpanded:boolean = false;

  constructor(private wfDataWraperMgr:WFDataWraperMgr,
              private delimitCardRecordWFMgr:DelimitCardRecordWFMgr,
              private leaguerDetailSynDataHolder: LeaguerDetailSynDataHolder,
              private productCardDetailCacheDataHolder: ProductCardDetailCacheDataHolder,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
              private storePackageProjectSynDataHolder:StorePackageProjectSynDataHolder,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private matDialog: MatDialog,
  ){
    ZmModalMgr.getInstance().reset(this.matDialog);
    this.service = new SelectReduceCardService(
      this.delimitCardRecordWFMgr,
      this.leaguerDetailSynDataHolder,
      this.productCardDetailCacheDataHolder,
      this.storeProductInfoSynDataHolder,
      this.storeGoodsSynDataHolder,
      this.storePackageProjectSynDataHolder,
      this.storeCardInfoSynDataHolder);
  }

  ngOnInit(): void {
    this.delimitCardRecordsWFCompData = this.wFDataWraper.getDelimitCardRecordsWFCompData();
    if(this.delimitCardRecordsWFCompData.reduceList.length>0){
      this.contentExpanded = true;
    }
    this.viewData = new SelectReduceCardViewData();
  }

  /**
   * 组件参数变化触发事件
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if(!AppUtils.isNullObj(changes.leaguerId) && !AppUtils.isNullObj(changes.leaguerId.currentValue) &&　!AppUtils.isNullOrWhiteSpace(changes.leaguerId.currentValue)){
      this.service.initViewData(changes.leaguerId.currentValue,(viewDataP:SelectReduceCardViewData)=>{
        this.viewData = viewDataP;
      })
    }
  }

  /**
   * 弹出选择划卡项popup
   */
  selectReduceItem(event): void {
    event.stopPropagation();
    let selectLeaguer = this.wFDataWraper.getCuserWFCompData().selectLeaguer;
    if(!AppUtils.isNullObj(selectLeaguer) && !AppUtils.isNullOrWhiteSpace(selectLeaguer.id)){
      const activeModal = ZmModalMgr.getInstance().newModal(SelectReduceCardPopup,null,null);
      //设置弹窗数据
      activeModal.componentInstance.data = SelectReduceCardPopupViewData.fromComp(this.viewData);
      activeModal.componentInstance.action = this.selectReduceItemCallback.bind(this);
    }else{
      AppUtils.showWarn("提示","请选择会员");
    }
  }

  /**
   * 选择划卡项回调
   */
  selectReduceItemCallback(choosedReduceCardItem:ReduceCardItem):void{
    this.contentExpanded = true;
    let reduceItemDataTmp = ReduceItemData.fromReduceCard(choosedReduceCardItem);
    this.wFDataWraper.getDelimitCardRecordsWFCompData().reduceList.push(reduceItemDataTmp);
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);

  }

  /**
   * 修改消费数量
   * @param e
   * @param itemP
   */
  changeCount(e,itemP:ReduceItemData){
    let reduceItemDataTmp = new ReduceItemData();
    AppUtils.copy(reduceItemDataTmp,itemP);
    let count = e.target.value;
    count = count?count:1;
    count = AppUtils.isPositiveInteger(count)?count:parseInt(count);
    if((itemP.restCount != -1) && (count > itemP.restCount)){
      AppUtils.showWarn("提示","划卡次数不能大于剩余次数");
      count = itemP.restCount;
    }
    reduceItemDataTmp.count = count;
    AppUtils.copy(itemP,reduceItemDataTmp);
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);

  }

  /**
   * 删除划卡项
   * @param index
   */
  deleteItem(indexP:number){
    let reduceItemData:ReduceItemData = this.delimitCardRecordsWFCompData.reduceList[indexP];
    let removeIndex:number;
    for(let i=0;i<this.viewData.choosedReduceCardList.length;i++){
      let item = this.viewData.choosedReduceCardList[i];
      if((reduceItemData.itemType == item.itemType) && (reduceItemData.id == item.id) && (reduceItemData.leaguerCardId == item.leaguerCardId)){
        removeIndex = i;
        break;
      }
    }
    this.viewData.choosedReduceCardList.splice(removeIndex,1);
    this.delimitCardRecordsWFCompData.reduceList.splice(indexP,1);
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);

  }

}

export class SelectReduceCardService{

  constructor(private delimitCardRecordWFMgr:DelimitCardRecordWFMgr,
              private leaguerDetailSynDataHolder: LeaguerDetailSynDataHolder,
              private productCardDetailCacheDataHolder: ProductCardDetailCacheDataHolder,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
              private storePackageProjectSynDataHolder:StorePackageProjectSynDataHolder,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
  ){}

  /**
   * @param leaguerId
   * @param callback
   */
  public async initViewData(leaguerId,callback:(viewDataP:SelectReduceCardViewData) => void){
    let viewDataTmp = new SelectReduceCardViewData();
    let storeId = SessionUtil.getInstance().getStoreId();

    let leaguer:LeaguerDetail = await this.leaguerDetailSynDataHolder.getData(leaguerId);
    if(!AppUtils.isNullObj(leaguer)){
      //店铺项目
      let storeProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
      let allProductMap = storeProductInfo?storeProductInfo.getAllProductInfoMap():new ZmMap<ProductInfo>();//会员已购买次卡  下架项目也要显示
      //店铺商品
      let storeGoods:StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
      let allGoodsMap = storeGoods?storeGoods.getAllGoodsMap():new ZmMap<Goods>();
      //店铺套餐
      let storePackageProject:StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
      let allPackageProjectMap = storePackageProject?storePackageProject.getAllPackageProjectMap():new ZmMap<PackageProject>();
      //组装次卡划卡项
      if(!AppUtils.isNullObj(leaguer.leaguerProductCardMap)){
        let storeCardInfo:StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
        let productCardMap = storeCardInfo.getProductCardMap()?storeCardInfo.getProductCardMap():new ZmMap<ProductCard>();
        let leaguerProductCardMap = leaguer.getValidLeaguerProductCardMap();//会员次卡
        let reduceFromCard = this.getReduceFromCard(leaguerProductCardMap, allProductMap, allGoodsMap, allPackageProjectMap,productCardMap);
        viewDataTmp.reduceCardList = AppUtils.addAll(viewDataTmp.reduceCardList,reduceFromCard);
      }
      //组装预存划卡项
      if(!AppUtils.isNullObj(leaguer.leaguerPreStoreCardMap)){
        let reductFromPreStoreCard = this.getReductFromPreStoreCard(leaguer.getPreStoreCardMap(), allProductMap, allGoodsMap, allPackageProjectMap);
        viewDataTmp.reduceCardList = AppUtils.addAll(viewDataTmp.reduceCardList,reductFromPreStoreCard);
      }
    }
    callback(viewDataTmp);
  }

  /**
   * 从会员预存遍历组装划卡列表
   * @param preStoreCardMap
   * @param allProductMap
   * @param allGoodsMap
   * @param allPackageProjectMap
   * @returns {ReduceCardItem[]}
   */
  private getReductFromPreStoreCard(preStoreCardMap: ZmMap<PreStoreCard>, allProductMap: ZmMap<ProductInfo>, allGoodsMap: ZmMap<Goods>, allPackageProjectMap: ZmMap<PackageProject>):Array<ReduceCardItem> {
    let reduceCardList = new Array<ReduceCardItem>();
    let preStoreCardList = preStoreCardMap.values();
    for (let i = 0; i < preStoreCardList.length; i++) {
      let preStoreCard = preStoreCardList[i];
      for (let j = 0; j < preStoreCard.leaguerPrdCardItems.length; j++) {
        let leaguerPrdCardItem = preStoreCard.leaguerPrdCardItems[j];
        let reduceCardItem = new ReduceCardItem();
        reduceCardItem.reductType = ReduceItemType.FromPreStoreCard;
        if (leaguerPrdCardItem.itemType == ProductCardItemEnum.PRODUCT) {//项目
          reduceCardItem.itemType = leaguerPrdCardItem.itemType;
          reduceCardItem.id = leaguerPrdCardItem.pgId;
          reduceCardItem.name = allProductMap.get(leaguerPrdCardItem.pgId).name;
          reduceCardItem.number = allProductMap.get(leaguerPrdCardItem.pgId).number;
          reduceCardItem.price = allProductMap.get(leaguerPrdCardItem.pgId).price;
          reduceCardItem.leaguerCardId = preStoreCard.id;
          reduceCardItem.cardName = "预存产品";
          reduceCardItem.restCount = leaguerPrdCardItem.restCount;
          reduceCardItem.totalCount = leaguerPrdCardItem.count;
        } else if (leaguerPrdCardItem.itemType == ProductCardItemEnum.GOODS) {//商品
          reduceCardItem.itemType = leaguerPrdCardItem.itemType;
          reduceCardItem.id = leaguerPrdCardItem.pgId;
          reduceCardItem.name = allGoodsMap.get(leaguerPrdCardItem.pgId).name;
          reduceCardItem.number = allGoodsMap.get(leaguerPrdCardItem.pgId).number;
          reduceCardItem.price = allGoodsMap.get(leaguerPrdCardItem.pgId).price;
          reduceCardItem.leaguerCardId = preStoreCard.id;
          reduceCardItem.cardName = "预存产品";
          reduceCardItem.restCount = leaguerPrdCardItem.restCount;
          reduceCardItem.totalCount = leaguerPrdCardItem.count;
        } else if (leaguerPrdCardItem.itemType == ProductCardItemEnum.PACKAGE) {//套餐
          reduceCardItem.itemType = leaguerPrdCardItem.itemType;
          reduceCardItem.id = leaguerPrdCardItem.pgId;
          reduceCardItem.name = allPackageProjectMap.get(leaguerPrdCardItem.pgId).name;
          reduceCardItem.number = allPackageProjectMap.get(leaguerPrdCardItem.pgId).number;
          reduceCardItem.price = allPackageProjectMap.get(leaguerPrdCardItem.pgId).sellPrice;
          reduceCardItem.leaguerCardId = preStoreCard.id;
          reduceCardItem.cardName = "预存产品";
          reduceCardItem.restCount = leaguerPrdCardItem.restCount;
          reduceCardItem.totalCount = leaguerPrdCardItem.count;
        }
        if (reduceCardItem.restCount > 0) {
          reduceCardList.push(reduceCardItem);
        }
      }
    }
    return reduceCardList;
  }

  /**
   * 从会员次卡遍历组装划卡列表
   * @param leaguerProductCardMap
   * @param allProductMap
   * @param allGoodsMap
   * @param allPackageProjectMap
   * @param productCardMap
   * @returns {Promise<ReduceCardItem[]>}
   */
  private getReduceFromCard(leaguerProductCardMap: ZmMap<LeaguerProductCard>, allProductMap: ZmMap<ProductInfo>, allGoodsMap: ZmMap<Goods>, allPackageProjectMap: ZmMap<PackageProject>,productCardMap:ZmMap<ProductCard>):Array<ReduceCardItem> {
    let reduceCardList = new Array<ReduceCardItem>();
    let leaguerProductCardList = leaguerProductCardMap.values();
    for (let i = 0; i < leaguerProductCardList.length; i++) {
      let leaguerProductCard = leaguerProductCardList[i];
      if (!AppUtils.isNullObj(leaguerProductCard.leaguerPrdCardItems)) {
        let productCard:ProductCard = productCardMap.get(leaguerProductCard.cardId);
        leaguerProductCard.leaguerPrdCardItems.forEach((leaguerPrdCardItem: LeaguerPrdCardItem) => {
          if(leaguerPrdCardItem.pgId == "-1"){//不限项目
            //旧数据
          }else if(leaguerPrdCardItem.pgId != "-1"){//限项目
            let reduceCardItem = new ReduceCardItem();
            if (leaguerPrdCardItem.itemType == ProductCardItemEnum.PRODUCT) {//项目
              reduceCardItem.itemType = leaguerPrdCardItem.itemType;
              reduceCardItem.id = leaguerPrdCardItem.pgId;
              reduceCardItem.name = allProductMap.get(leaguerPrdCardItem.pgId).name;
              reduceCardItem.number = allProductMap.get(leaguerPrdCardItem.pgId).number;
              reduceCardItem.price = allProductMap.get(leaguerPrdCardItem.pgId).price;
              reduceCardItem.leaguerCardId = leaguerProductCard.id;
              reduceCardItem.cardName = productCard.name;
              reduceCardItem.restCount = leaguerPrdCardItem.restCount;
              reduceCardItem.totalCount = leaguerPrdCardItem.count;
            } else if (leaguerPrdCardItem.itemType == ProductCardItemEnum.GOODS) {//商品
              reduceCardItem.itemType = leaguerPrdCardItem.itemType;
              reduceCardItem.id = leaguerPrdCardItem.pgId;
              reduceCardItem.name = allGoodsMap.get(leaguerPrdCardItem.pgId).name;
              reduceCardItem.number = allGoodsMap.get(leaguerPrdCardItem.pgId).number;
              reduceCardItem.price = allGoodsMap.get(leaguerPrdCardItem.pgId).price;
              reduceCardItem.leaguerCardId = leaguerProductCard.id;
              reduceCardItem.cardName = productCard.name;
              reduceCardItem.restCount = leaguerPrdCardItem.restCount;
              reduceCardItem.totalCount = leaguerPrdCardItem.count;
            } else if (leaguerPrdCardItem.itemType == ProductCardItemEnum.PACKAGE) {//套餐
              reduceCardItem.itemType = leaguerPrdCardItem.itemType;
              reduceCardItem.id = leaguerPrdCardItem.pgId;
              reduceCardItem.name = allPackageProjectMap.get(leaguerPrdCardItem.pgId).name;
              reduceCardItem.number = allPackageProjectMap.get(leaguerPrdCardItem.pgId).number;
              reduceCardItem.price = allPackageProjectMap.get(leaguerPrdCardItem.pgId).sellPrice;
              reduceCardItem.leaguerCardId = leaguerProductCard.id;
              reduceCardItem.cardName = productCard.name;
              reduceCardItem.restCount = leaguerPrdCardItem.restCount;
              reduceCardItem.totalCount = leaguerPrdCardItem.count;
            }
            if (reduceCardItem.restCount == -1 || reduceCardItem.restCount > 0) {
              reduceCardList.push(reduceCardItem);
            }
          }
        })
      }
    }
    return reduceCardList;
  }

  /**
   * 添加划卡项
   * @param wfId
   * @param callback
   */
  public addDelimitCardRecordWF(reduceItemData:ReduceItemData,wfId,callback:(successP:boolean) => void){
    let delimitCardRecordAddForm = new DelimitCardRecordAddForm();
    delimitCardRecordAddForm.itemType = reduceItemData.itemType;
    delimitCardRecordAddForm.pgId = reduceItemData.id;
    delimitCardRecordAddForm.count = reduceItemData.count;
    delimitCardRecordAddForm.leaguerPrdCardId = reduceItemData.leaguerCardId;
    this.delimitCardRecordWFMgr.addDelimitCardRecordWF(wfId,delimitCardRecordAddForm).then((success:boolean)=>{
      callback(success);
    })
  }

  /**
   * 修改划卡信息
   * @param reduceItemData
   * @param callback
   */
  public updateDelimitCardRecordWF(wfId:string,reduceItemData:ReduceItemData,callback:(successP:boolean) => void){
    let delimitCardId = this.getDecreasePrdCardId(reduceItemData);
    let delimitCardRecordUpdateForm = new DelimitCardRecordUpdateForm();
    delimitCardRecordUpdateForm.delimitCardId = delimitCardId;
    delimitCardRecordUpdateForm.count = reduceItemData.count;
    this.delimitCardRecordWFMgr.updateDelimitCardRecordWF(wfId,delimitCardId,delimitCardRecordUpdateForm).then((success) =>{
      callback(success);
    })
  }

  /**
   * 获取划卡项id
   * @param reduceItemData
   * @returns {string}
   */
  private getDecreasePrdCardId(reduceItemData:ReduceItemData) {
    let delimitCardId = AppUtils.format("{0}_{1}_{2}", reduceItemData.leaguerCardId, reduceItemData.id, reduceItemData.itemType);
    return delimitCardId;
  }

  /**
   * 删除工作流
   */
  public deleteProductItemWF(wfId:string,reduceItemData:ReduceItemData,callback:(success:boolean) => void){
    let delimitCardId = this.getDecreasePrdCardId(reduceItemData);
    this.delimitCardRecordWFMgr.deleteDelimitCardRecordWF(wfId,delimitCardId).then((success) =>{
      callback(success);
    });
  }

}

export class SelectReduceCardViewData{
  public reduceCardList: Array<ReduceCardItem> = new Array();//所有划卡项列表
  public choosedReduceCardList: Array<ReduceCardItem> = new Array();//已选择的划卡项列表
}

export class ReduceCardItem{
  public reductType:number = ReduceItemType.FromCard;//ReduceItemType 默认次卡
  public itemType:number;//项目、商品、套餐 ProductCardItemEnum
  public id:string;//项目、商品、套餐id
  public name:string = "";//项目、商品、套餐名称
  public number:string;//项目、商品、套餐编号
  public price:number = 0;//项目、商品、套餐价格 用于结算列表显示
  public leaguerCardId:string = "";//所属会员次卡id
  public cardName:string;//所属次卡名称
  public totalCount:number = 0;//总次数
  public restCount:number = 0;//剩余次数
}



