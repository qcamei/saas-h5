import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {BonusViewDataMgr} from "../bonusViewDataMgr";
import {ActivatedRoute, Router} from "@angular/router";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {BonusRecord} from "../../../bsModule/bonusRecord/data/BonusRecord";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BonusRecordMgr} from "../../../bsModule/bonusRecord/BonusRecordMgr";
import {DatePipe} from "@angular/common";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BonusRecordQueryForm} from "../../../bsModule/bonusRecord/apiData/BonusRecordQueryForm";
import {
  BonusRecordDataHelper,
  BuserMonthBonus,
  BuserRoleBonusInfo
} from "../../../bsModule/bonusRecord/data/BonusRecordDataHelper";
import {BuyTypeEnum} from "../../../bsModule/order/data/BuyTypeEnum";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";

/**
 * 提成管理 提成详情
 */
@Component({
  selector:'bonus-detail',
  templateUrl:'bonusDetail.html',
  styleUrls:['bonusDetail.scss']
})
export class BonusDetailPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private paramSub:any;
  private service: BonusDetailService;
  public viewData: BonusDetailViewData;
  private buserId:string;

  constructor(
              private buserMgr:BUserMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private bonusRecordMgr:BonusRecordMgr,
              private datePipe: DatePipe,
              private bonusViewDataMgr:BonusViewDataMgr,
              private cdRef:ChangeDetectorRef,
              private route:ActivatedRoute,
              private router:Router){
    this.service = new BonusDetailService(
      this.bonusViewDataMgr,
      this.bonusRecordMgr,
      this.buserMgr,
      this.storeClerkInfoSynDataHolder,
      this.storeGoodsSynDataHolder,
      this.storeProductInfoSynDataHolder,
      this.storeCardInfoSynDataHolder,
      this.datePipe);
  }

  ngOnInit(): void {
    this.viewDataSub = this.bonusViewDataMgr.subscribeBonusDetailVD((viewDataP:BonusDetailViewData) =>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.paramSub = this.route.params.subscribe(params =>{
      let buserId = params['buserId'];
      this.buserId = buserId;
      this.service.initViewData(buserId);
    })
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
    this.paramSub.unsubscribe();
  }

  goOrderDetail(orderId,buyType){
    if(buyType == BuyTypeEnum.RECHARGE){
      this.router.navigate(['/main/order/orderRechargeDetail/'+orderId]);
    }else{
      this.router.navigate(['/main/order/orderConsumeDetail/'+orderId]);
    }
  }
  findOrderBonusList(){
    // console.log(dateObj);
    // if(flag=="end"){
    //   this.viewData.orderQueryParam.orderEndDate = dateObj;
    // }else if(flag=='start'){
    //   this.viewData.orderQueryParam.orderStartDate = dateObj;
    // }
    this.service.findOrderBonusList(this.buserId, this.viewData, this.viewData.orderQueryParam);
  }

  findMonthBonusList(){
    // if(flag=="end"){
    //   this.viewData.monthQueryParam.monthEndDate = dateObj;
    // }else if('start'){
    //   this.viewData.monthQueryParam.monthStartDate = dateObj;
    // }
    this.service.findMonthBonusList(this.buserId, this.viewData, this.viewData.monthQueryParam);
  }
}

export class BonusDetailService{
  constructor(
    private bonusViewDataMgr:BonusViewDataMgr,
    private bonusRecordMgr:BonusRecordMgr,
    private buserMgr:BUserMgr,
    private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
    private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
    private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
    private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
    private datePipe: DatePipe){}

  public initViewData(buserId): void{
    this.bonusViewDataMgr.setBonusDetailViewData(new BonusDetailViewData());

    this.buildViewData(buserId,(viewDataP:BonusDetailViewData) =>{
      this.handleViewData(viewDataP);
    })
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP:BonusDetailViewData){
    this.bonusViewDataMgr.setBonusDetailViewData(viewDataP);
  }

  /**
   * 请求店铺信息 组装viewData
   * @param callbackP
   */
  public async buildViewData(buserId,callbackP:(viewDataP:BonusDetailViewData) => void){
    let viewDataTmp:BonusDetailViewData = new BonusDetailViewData();
    //构造用户基本信息
    let storeId = SessionUtil.getInstance().getStoreId();
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
    let storeGoods = await this.storeGoodsSynDataHolder.getData(storeId);
    let storeProduct = await this.storeProductInfoSynDataHolder.getData(storeId);
    let storePrdCard = await this.storeCardInfoSynDataHolder.getData(storeId);

    let clerkInfoMap = storeClerkInfo.clerkInfoMap;
    let buserIds:Array<string>= new Array<string>();
    for (let index in clerkInfoMap) {
      if(clerkInfoMap[index].buserId == buserId){
        buserIds.push(clerkInfoMap[index].buserId);
      }
    }
    let busers = await this.buserMgr.findByMultitId(buserIds);
    let buserRoleBonusInfoMap =BonusRecordDataHelper.buildBuserRoleBonusInfo(storeClerkInfo, busers);
    viewDataTmp.buserRoleBonusInfo = buserRoleBonusInfoMap.get(buserId);
    viewDataTmp.productCardMap=storePrdCard.getProductCardMap();
    viewDataTmp.productMap=storeProduct.getAllProductInfoMap();
    viewDataTmp.goodsMap=storeGoods.getAllGoodsMap();

    //构建当年与当月的提成
    let nowDate:Date = new Date();
    let monthStr:string = this.datePipe.transform(nowDate,'yyyy/MM');
    let monthQueryParam:any={
      "monthStartDate":{"year":nowDate.getFullYear(),"month":1,"day":1},
      "monthEndDate":{"year":nowDate.getFullYear(),"month":nowDate.getMonth()+1,"day":nowDate.getDate()}
    };
    let orderQueryParam:any={
      "orderStartDate":{"year":nowDate.getFullYear(),"month":nowDate.getMonth()+1,"day":1},
      "orderEndDate":{"year":nowDate.getFullYear(),"month":nowDate.getMonth()+1,"day":nowDate.getDate()},
      "orderNumber":""
    };
    viewDataTmp.monthQueryParam = monthQueryParam;
    viewDataTmp.orderQueryParam = orderQueryParam;
    await this.findMonthBonusList(buserId, viewDataTmp, monthQueryParam);
    let buserBonusList = viewDataTmp.monthRecordList.filter((item)=>{
      if(monthStr == this.datePipe.transform(item.orderTime,'yyyy/MM')){
        return true;
      }else{
        return false;
      }
    });
    viewDataTmp.bonusRecordList=buserBonusList;

    this.resetListData(buserBonusList, viewDataTmp);

    viewDataTmp.loadingFinish = true;
    callbackP(viewDataTmp);
  }

  public async findOrderBonusList(buserId:string, viewData:BonusDetailViewData, orderQueryParam:any){

    viewData.loadingFinish = false;
    let queryForm=new BonusRecordQueryForm();
    queryForm.storeId=SessionUtil.getInstance().getStoreId();
    queryForm.pageNo=1;
    queryForm.pageItemCount=100000;
    let orderStartDate = orderQueryParam.orderStartDate;
    let orderEndDate = orderQueryParam.orderEndDate;
    let endTimeStr:string = " 23:59:59";
    if(!AppUtils.isNullObj(orderStartDate) && !AppUtils.isNullObj(orderEndDate)){
      queryForm.minTime = new Date([orderStartDate.year,orderStartDate.month,orderStartDate.day].join("-")).getTime()+"";
      queryForm.maxTime= new Date([orderEndDate.year,orderEndDate.month,orderEndDate.day].join("-")+endTimeStr).getTime()+"";
    }else if(!AppUtils.isNullObj(orderStartDate) && AppUtils.isNullObj(orderQueryParam.monthEndDate)){
      queryForm.minTime = new Date([orderStartDate.year,orderStartDate.monthStartDate.day].join("-")).getTime()+"";
      queryForm.maxTime= "0";
    }else{
      queryForm.minTime = "0";
      queryForm.maxTime= new Date([orderEndDate.year,orderEndDate.month,orderEndDate.day].join("-")+endTimeStr).getTime()+"";
    }
    let tmpRecordList:Array<BonusRecord> = await this.bonusRecordMgr.findBonusRecordList(queryForm);
    let bonusRecordList:Array<BonusRecord> = tmpRecordList.filter((item)=>{
      if((AppUtils.isNullOrWhiteSpace(orderQueryParam.orderNumber) || item.orderNumber.indexOf(orderQueryParam.orderNumber) > -1) && item.buserId==buserId){
        return true;
      }else{
        return false;
      }
    });
    this.resetListData(bonusRecordList, viewData);

    viewData.bonusRecordList = bonusRecordList;
    viewData.loadingFinish = true;
    this.handleViewData(viewData);
  }

  private resetListData(bonusRecordList:Array<BonusRecord>, viewData:BonusDetailViewData):void{
    for(let index in bonusRecordList){
      let bonusRecord = bonusRecordList[index];
      bonusRecord.buyName=this.getBuyName(bonusRecord.pgId, bonusRecord.buyType, viewData);
    }
  }

  private getBuyName(pgId:string, buyType:number, viewData:BonusDetailViewData):string{
    let buyName:string="";
    if(buyType == BuyTypeEnum.GOODS && viewData.goodsMap.get(pgId)){
      buyName=viewData.goodsMap.get(pgId).name;
    }else if(buyType == BuyTypeEnum.PRDCARD && viewData.productCardMap.get(pgId)){
      buyName=viewData.productCardMap.get(pgId).name;
    }else if(buyType == BuyTypeEnum.PRODUCT && viewData.productMap.get(pgId)){
      buyName=viewData.productMap.get(pgId).name;
    }else if(buyType == BuyTypeEnum.RECHARGE){
      buyName="会员充值";
    }else{
      buyName = "-";
    }
    return buyName;
  }

  public async findMonthBonusList(buserId:string, viewData:BonusDetailViewData, monthQueryParam:any){
    viewData.loadingFinish = false;
    let queryForm=new BonusRecordQueryForm();
    queryForm.storeId=SessionUtil.getInstance().getStoreId();
    queryForm.pageNo=1;
    queryForm.pageItemCount=100000;
    //时间过滤
    if(AppUtils.isNullObj(monthQueryParam.monthStartDate) && AppUtils.isNullObj(monthQueryParam.monthEndDate)){
      return;
    }
    let monthStartDate = monthQueryParam.monthStartDate;
    let monthEndDate = monthQueryParam.monthEndDate;
    let endTimeStr:string = " 23:59:59";
    if(!AppUtils.isNullObj(monthStartDate) && !AppUtils.isNullObj(monthEndDate)){
      queryForm.minTime = new Date([monthStartDate.year,monthStartDate.month,monthStartDate.day].join("-")).getTime()+"";
      queryForm.maxTime= new Date([monthEndDate.year,monthEndDate.month,monthEndDate.day].join("-")+endTimeStr).getTime()+"";
    }else if(!AppUtils.isNullObj(monthStartDate) && AppUtils.isNullObj(monthEndDate)){
      queryForm.minTime = new Date([monthStartDate.year,monthStartDate.monthStartDate.day].join("-")).getTime()+"";
      queryForm.maxTime= "0";
    }else{
      queryForm.minTime = "0";
      queryForm.maxTime= new Date([monthEndDate.year,monthEndDate.month,monthEndDate.day].join("-")+endTimeStr).getTime()+"";
    }

    let tmpBonusRecordList:Array<BonusRecord> = await this.bonusRecordMgr.findBonusRecordList(queryForm);
    let bonusRecordList:Array<BonusRecord> = tmpBonusRecordList.filter((item)=>{
      if(item.buserId==buserId){
        return true;
      }else{
        return false;
      }
    });

    this.resetListData(bonusRecordList, viewData);

    let buserRoleBonusInfoMap:ZmMap<BuserRoleBonusInfo> = new ZmMap<BuserRoleBonusInfo>();
    buserRoleBonusInfoMap.put(buserId, viewData.buserRoleBonusInfo);
    let buserMonthBonusMap = BonusRecordDataHelper.buildBuserMonthBonusMap(bonusRecordList, buserRoleBonusInfoMap);
    let buserMonthBonusList:Array<BuserMonthBonus>= buserMonthBonusMap.values();
    buserMonthBonusList.sort((a:BuserMonthBonus,b:BuserMonthBonus):number => {
      if(a.dateStr < b.dateStr){
        return -1;
      }else if(a.dateStr > b.dateStr){
        return 1;
      }else {
        return 0;
      }
    });
    viewData.monthRecordList = bonusRecordList;
    viewData.buserMonthBonusList = buserMonthBonusList;

    viewData.loadingFinish = true;
    this.handleViewData(viewData);
  }

}

export class BonusDetailViewData{
  //订单查询参数
  public orderQueryParam:any={"orderStartDate":{"year":2017,"month":12,"day":18},"orderEndDate":{"year":2017,"month":12,"day":18},"orderNumber":""};
  //查询结果列表
  public bonusRecordList:Array<BonusRecord> = new Array<BonusRecord>();

  //用户基本信息和角色信息
  public buserRoleBonusInfo:BuserRoleBonusInfo = new BuserRoleBonusInfo();

  public goodsMap:ZmMap<Goods> = new ZmMap<Goods>();
  public productMap:ZmMap<ProductInfo> = new ZmMap<ProductInfo>();
  public productCardMap:ZmMap<ProductCard> = new ZmMap<ProductCard>();

  //每月提成查询
  public monthQueryParam:any={"monthStartDate":{"year":2017,"month":12,"day":18},"monthEndDate":{"year":2017,"month":12,"day":18}};
  //查询结果列表
  public monthRecordList:Array<BonusRecord> = new Array<BonusRecord>();
  //用户月度提成数据列表
  public buserMonthBonusList:Array<BuserMonthBonus> = new Array<BuserMonthBonus>();

  public loadingFinish:boolean = false;
}
