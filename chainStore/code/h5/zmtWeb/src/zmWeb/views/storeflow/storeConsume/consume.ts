import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {WorkFlowData} from "../../../bsModule/workFlow/data/WorkFlowData";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {WorkFlowMgr} from "../../../bsModule/workFlow/WorkFlowMgr";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {WorkFlowTypeMgr} from "../../../bsModule/workFlowType/WorkFlowTypeMgr";
import {BuyTypeEnum} from "../../../bsModule/workFlow/data/BuyTypeEnum";
import {UserBonus} from "../../../bsModule/workFlow/data/UserBonus";
import {ActivatedRoute} from "@angular/router";
import {ProdRecord} from "../../../bsModule/workFlow/data/ProdRecord";
import {DecreasePrdCardRecord} from "../../../bsModule/workFlow/data/DecreasePrdCardRecord";
import {GoodsRecord} from "../../../bsModule/workFlow/data/GoodsRecord";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {StoreCardInfo} from "../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {PrdCardRecord} from "../../../bsModule/workFlow/data/PrdCardRecord";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {BonusInfo} from "../../../bsModule/workFlow/data/BonusInfo";
import {WorkFlowDataStatusEnum} from "../../../bsModule/workFlow/data/WorkFlowDataStatusEnum";
import {
  StaffData, WFDataWraper, FollowClerk, ProductItemData, GoodsItemData,
  CardItemData, BonusWFCompData, BonusItemData, PackageItemData, ReduceItemData, SuperItemData, ReduceItemType
} from "../wfComp/WFDataWraper";
import {WFDataWraperMgr} from "../wfComp/WFDataWraperMgr";
import {WorkFlowType} from "../../../bsModule/workFlowType/data/WorkFlowType";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {LeaguerDetailSynDataHolder} from "../../../bsModule/leaguerDetail/LeaguerDetailSynDataHolder";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {PackagePrjRecord} from "../../../bsModule/workFlow/data/PackagePrjRecord";
import {StorePackageProjectSynDataHolder} from "../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StorePackageProject} from "../../../bsModule/storePackageProject/data/StorePackageProject";
import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {DelimitCardRecord} from "../../../bsModule/workFlow/data/DelimitCardRecord";
import {ProductCardItemEnum} from "../../../bsModule/productCardDetail/data/ProductCardItemEnum";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {LeaguerProductCard} from "../../../bsModule/storeLeaguerInfo/data/LeaguerProductCard";
import {ProductCardDetailCacheDataHolder} from "../../../bsModule/productCardDetail/productCardDetailCacheDataHolder";
import {PrdCardPayEnum} from "../../../bsModule/workFlow/data/PrdCardPayEnum";
import {RecordTypeEnum} from "../../../bsModule/workFlow/data/RecordTypeEnum";
import {OrderComp} from "../orderComp/orderComp";
import {ConsumeSavePopup} from "../consumeSavePopup";
import {ConsumeSaveEnum} from "../wfComp/ConsumeSaveEnum";
import {WorkFlowDataSaveTypeEnum} from "../../../bsModule/workFlow/apiData/save/WorkFlowDataSaveTypeEnum";
import {Constants} from "../../common/Util/Constants";
import {PreStoreCardRecord} from "../../../bsModule/workFlow/data/PreStoreCardRecord";
import {PreStoreCard} from "../../../bsModule/leaguerDetail/data/PreStoreCard";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {ZmTimeData} from "../../zmComp/date/ZmTime";
import {DateWrap} from "../../zmComp/date/timeSlot/DateWrap";
import {TimeSlotHelper} from "../../zmComp/date/timeSlot/TimeSlotHelper";
import {OldRecordHelper} from "../../../bsModule/workFlow/apiData/save/OldRecordHelper";

@Component({
  selector: 'consume',
  templateUrl: './consume.html',
  styleUrls:['./consume.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsumePage implements OnInit,OnDestroy{
  a="2";
  // 开始时间
  getAppointmentByReq(){

  }


  public wFDataWraperSub:any;
  public service:ConsumeService;
  public viewData:ConsumeViewData = new ConsumeViewData();
  public wFDataWraper:WFDataWraper;

  //补单相关
  isAddOldRecord:boolean;
  date: DateWrap;//补单日期
  time: ZmTimeData;//补单时间

  @ViewChild('orderComp') orderComp:OrderComp;//结算组件

	constructor(private wfDataWraperMgr:WFDataWraperMgr,
              private workFlowTypeMgr:WorkFlowTypeMgr,
              private workFlowMgr:WorkFlowMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private leaguerDetailSynDataHolder:LeaguerDetailSynDataHolder,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private storePackageProjectSynDataHolder:StorePackageProjectSynDataHolder,
              private productCardDetailCacheDataHolder:ProductCardDetailCacheDataHolder,
              private matDialog: MatDialog,
              private cdRef: ChangeDetectorRef,
              private route:ActivatedRoute){

    this.isAddOldRecord = OldRecordHelper.getInstance().isOldRecord;
    OldRecordHelper.reset();//重置和补单相关的字段
    let date: Date = TimeSlotHelper.getCurTime();
    this.date = TimeSlotHelper.getDateWrapByDate(date);//获取当前时间的 DateWrap
    this.time = TimeSlotHelper.getZmTimeDataByDate(date);//获取 当前时间的 ZmTimeData

	  ZmModalMgr.getInstance().reset(matDialog);
	  this.service = new ConsumeService(
      this.workFlowTypeMgr,
      this.workFlowMgr,
      this.storeClerkInfoSynDataHolder,
      this.buserMgr,
      this.leaguerDetailSynDataHolder,
      this.storeProductInfoSynDataHolder,
      this.storeGoodsSynDataHolder,
      this.storeCardInfoSynDataHolder,
      this.storePackageProjectSynDataHolder,
      this.productCardDetailCacheDataHolder,
      this.wfDataWraperMgr,
    );
  }

  ngOnInit(): void {
    this.wFDataWraper = this.wfDataWraperMgr.init(Constants.CONSUMEWFNAME);

    this.wFDataWraperSub = this.wfDataWraperMgr.subscribeWFDataWraper((wfDataWraper:WFDataWraper) => {
      let wFDataWraperTmp:WFDataWraper = new WFDataWraper(Constants.CONSUMEWFNAME);
      AppUtils.copy(wFDataWraperTmp,wfDataWraper);
      this.wFDataWraper = wFDataWraperTmp;
      this.wFDataWraper.isAddOldRecord = this.isAddOldRecord;//赋值
      this.wFDataWraper.date = this.date;
      this.wFDataWraper.time = this.time;
      this.cdRef.markForCheck();
    });

	  this.route.params.subscribe((params) =>{
	    let workFlowId = params["workFlowId"];
      let leaguerId = params["leaguerId"];
      this.wFDataWraper = this.wfDataWraperMgr.init(Constants.CONSUMEWFNAME);
      this.service.initViewData(workFlowId,leaguerId,this.wFDataWraper,(viewData:ConsumeViewData) => {
        if(viewData){
          this.viewData = viewData;
          this.wFDataWraper.setWorkFlowType(viewData.workFlowType);
          this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
        }
      });
    })
  }


  /**
   * 日期改变
   */
  onDateChange() {
    if(AppUtils.isNullObj(this.wFDataWraper))return;
    this.wFDataWraper.date = this.date;
  }


  ngOnDestroy(): void {

  }

  /**
   * 保存弹框
   */
  showSavePopup():Promise<boolean>{
    return new Promise<boolean>(resolve=>{
      const activeModal = ZmModalMgr.getInstance().newModal(ConsumeSavePopup);
      activeModal.componentInstance.action = (result)=>{
        if(result==ConsumeSaveEnum.SAVE){
          this.orderComp.service.saveWFData(this.wFDataWraper,WorkFlowDataSaveTypeEnum.SAVE).then((workFlowData)=>{
            if(!AppUtils.isNullObj(workFlowData)){
              AppUtils.showSuccess("提示","保存成功");
              resolve(true);
            }else{
              AppUtils.showError("提示","保存失败");
              resolve(false);
            }
          })
        }else if(result==ConsumeSaveEnum.UNSAVE){
          resolve(true);
        }else if(result==ConsumeSaveEnum.CANCEL){
          resolve(false);
        }
      }
    })
  }

}

export class ConsumeService {

  constructor(private workFlowTypeMgr: WorkFlowTypeMgr,
              private workFlowMgr: WorkFlowMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr: BUserMgr,
              private leaguerDetailSynDataHolder:LeaguerDetailSynDataHolder,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private storePackageProjectSynDataHolder:StorePackageProjectSynDataHolder,
              private productCardDetailCacheDataHolder:ProductCardDetailCacheDataHolder,
              private wfDataWraperMgr:WFDataWraperMgr,
              ) {
  }

  public async initViewData(workFlowId,leaguerId, wFDataWraper: WFDataWraper, callback: (viewDataP: ConsumeViewData) => void) {
    let viewDataTmp = new ConsumeViewData();

    //处理从组件新增会员的情况
    if(leaguerId){
      this.setLeaguerData(leaguerId,wFDataWraper);
    }


    /*************************************已有工作流 数据回填*********************************/
    if (AppUtils.isPositiveInteger(workFlowId)) {
      let storeId = SessionUtil.getInstance().getStoreId();
      let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);

      //请求workFlowType
      let workFlowType: WorkFlowType = await this.workFlowTypeMgr.findByName(wFDataWraper.getWFTypeName());
      viewDataTmp.workFlowType = workFlowType;

      let workFlowData: WorkFlowData = await this.workFlowMgr.get(workFlowId);
      wFDataWraper.setWorkFlowData(workFlowData);
      wFDataWraper.setWorkFlowType(workFlowType);
      if (workFlowData.status == WorkFlowDataStatusEnum.OPEN) {//未完成工作流
        /*******************************准备店铺员工数据******************************/
        let storeClerkInfoId = clerkInfoId;
        let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(storeClerkInfoId);
        viewDataTmp.clerkMap = storeClerkInfo.getClerkMap();
        viewDataTmp.roleMap = storeClerkInfo.getRoleMap();

        //请求所有员工信息
        let clerkMap = viewDataTmp.clerkMap;
        let clerkIdArray = clerkMap.keys();
        let buserList = await this.buserMgr.findByMultitId(clerkIdArray);
        viewDataTmp.buserMap = this.buildBuserMap(buserList);
        /*******************************准备店铺员工数据******************************/


        /***********************************已选会员****************************************/
        if (workFlowData.leaguerInfo) {//已选择会员
          this.setLeaguerData(workFlowData.leaguerInfo.leaguerId,wFDataWraper);


          /***********************************已选跟进人员****************************************/
          if (AppUtils.isPositiveInteger(workFlowData.leaguerInfo.followUserId)) {
            let buser: BUser = viewDataTmp.buserMap.get(workFlowData.leaguerInfo.followUserId);
            wFDataWraper.getBuserWFCompData().selectFollowClerk = FollowClerk.fromBuserItem(buser);
          }
        }

        /*************************************已选项目**************************************/
        if (workFlowData.prodRecordMap) {//已选项目
          let prodRecordsWFCompData = wFDataWraper.getProdRecordsWFCompData();
          let giftWFCompData = wFDataWraper.getGiftWFCompData();
          let storeProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
          let productList = this.getProdRecordList(workFlowData.prodRecordMap, storeProductInfo.getAllProductInfoMap());
          prodRecordsWFCompData.productList = productList.filter((item)=>{
            if(item.recordType == RecordTypeEnum.Buy){
              return true;
            }else{
              return false;
            }
          })
          giftWFCompData.productList = productList.filter((item)=>{
            if(item.recordType == RecordTypeEnum.Donation){
              return true;
            }else{
              return false;
            }
          })
        }

        /*************************************已选商品**************************************/
        if (workFlowData.goodsRecordMap) {//已选商品
          let attachProdsWFCompData = wFDataWraper.getAttachProdsWFCompData();
          let giftWFCompData = wFDataWraper.getGiftWFCompData();
          let storeGoods: StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
          let goodsList = this.getGoodsList(workFlowData.goodsRecordMap, storeGoods.getAllGoodsMap());
          attachProdsWFCompData.goodsList = goodsList.filter((item)=>{
            if(item.recordType == RecordTypeEnum.Buy){
              return true;
            }else{
              return false;
            }
          })
          giftWFCompData.goodsList = goodsList.filter((item)=>{
            if(item.recordType == RecordTypeEnum.Donation){
              return true;
            }else{
              return false;
            }
          })
        }

        /*************************************已选次卡**************************************/
        if (workFlowData.prdCardRecordMap) {//已选次卡
          let productCardWFCompData = wFDataWraper.getProductCardWFCompData();
          let giftWFCompData = wFDataWraper.getGiftWFCompData();
          let storeCardInfo: StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
          let cardList = this.getCardList(workFlowData.prdCardRecordMap, storeCardInfo.getProductCardMap());
          productCardWFCompData.cardList = cardList.filter((item)=>{
            if(item.recordType == RecordTypeEnum.Buy){
              return true;
            }else{
              return false;
            }
          })
          giftWFCompData.cardList = cardList.filter((item)=>{
            if(item.recordType == RecordTypeEnum.Donation){
              return true;
            }else{
              return false;
            }
          })
        }

        /*************************************已选套餐**************************************/
        if (workFlowData.packagePrjRecordMap) {//已选套餐
          let packageWFCompData = wFDataWraper.getPackageWFCompData();
          let giftWFCompData = wFDataWraper.getGiftWFCompData();
          let storePackageProject:StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
          let packageList = this.getPackageList(workFlowData.packagePrjRecordMap,storePackageProject.getAllPackageProjectMap());
          packageWFCompData.packageList = packageList.filter((item)=>{
            if(item.recordType == RecordTypeEnum.Buy){
              return true;
            }else{
              return false;
            }
          })
          giftWFCompData.packageList = packageList.filter((item)=>{
            if(item.recordType == RecordTypeEnum.Donation){
              return true;
            }else{
              return false;
            }
          })
        }

        /*************************************已选划卡**************************************/
        // if (workFlowData.decreasePrdCardRecordMap) {//已选会员划卡
        //   let selectLeaguer:LeaguerDetail = wFDataWraper.getCuserWFCompData().selectLeaguer;
        //   let storeCardInfo: StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
        //   let cardProductList = this.getCardProductList(workFlowData.decreasePrdCardRecordMap, storeProductInfo.getAllProductInfoMap(),storeCardInfo.getProductCardMap(),selectLeaguer);
        //   prodRecordsWFCompData.productList = AppUtils.addAll(prodRecordsWFCompData.productList, cardProductList);
        // }
        if(workFlowData.delimitCardRecordMap){
          let delimitCardRecordsWFCompData = wFDataWraper.getDelimitCardRecordsWFCompData();
          let leaguer = wFDataWraper.getCuserWFCompData().selectLeaguer;
          let storeProductInfo:StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
          let storeGoods:StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
          let storePackageProject:StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
          let storeCardInfo:StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
          let reduceFromCard= this.getDelimitCardRecords(workFlowData.delimitCardRecordMap,leaguer.getLeaguerProductCardMap(),storeProductInfo.getAllProductInfoMap(),storeGoods.getAllGoodsMap(),storePackageProject.getAllPackageProjectMap(),storeCardInfo.getProductCardMap());
          delimitCardRecordsWFCompData.reduceList = AppUtils.addAll(delimitCardRecordsWFCompData.reduceList,reduceFromCard);
        }
        //预存项划卡
        if(workFlowData.preStoreCardRecordMap){
          let delimitCardRecordsWFCompData = wFDataWraper.getDelimitCardRecordsWFCompData();
          let leaguer = wFDataWraper.getCuserWFCompData().selectLeaguer;
          let storeProductInfo:StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
          let storeGoods:StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
          let storePackageProject:StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
          let storeCardInfo:StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
          let reductFromPreStoreCard = this.getPreStoreCardRecords(workFlowData.preStoreCardRecordMap,leaguer.getPreStoreCardMap(),storeProductInfo.getAllProductInfoMap(),storeGoods.getAllGoodsMap(),storePackageProject.getAllPackageProjectMap(),storeCardInfo.getProductCardMap());
          delimitCardRecordsWFCompData.reduceList = AppUtils.addAll(delimitCardRecordsWFCompData.reduceList,reductFromPreStoreCard);
        }

        //组装提成项列表
        this.wfDataWraperMgr.setWFDataWraper(wFDataWraper);

        /*************************************已选提成**************************************/
        if (workFlowData.bonusInfoMap) {//已选提成
          let bonusWFCompData: BonusWFCompData = wFDataWraper.getBonusWFCompData();
          let bonusInfoMap = new ZmMap<BonusInfo>();
          for (let index in workFlowData.bonusInfoMap) {
            let bonusInfo: BonusInfo = workFlowData.bonusInfoMap[index];
            bonusInfoMap.put(bonusInfo.bonusId, bonusInfo);
          }
          viewDataTmp.bonusInfoMap = bonusInfoMap;

          //组装提成 staffList
          bonusWFCompData.bonusList.forEach((item) => {
            item.staffBonusList = this.getStaffList(item,viewDataTmp.bonusInfoMap,viewDataTmp.buserMap,viewDataTmp.clerkMap,viewDataTmp.roleMap);
            item.staffName = item.staffBonusList.map((item) => {
              return item.name;
            }).join("、");
          });
        }

        //刷新数据
        this.wfDataWraperMgr.setWFDataWraper(wFDataWraper);
      }
    }
    /*************************************已有工作流 数据回填*********************************/

    callback(viewDataTmp);
  }

  private async setLeaguerData(leaguerId,wFDataWraper){
    let leaguerDetail:LeaguerDetail = await this.leaguerDetailSynDataHolder.getData(leaguerId);
    let leaguer = leaguerDetail.encryptLeaguerDetail4New();
    wFDataWraper.getCuserWFCompData().selectLeaguer = leaguer;
    let split = leaguer.id.split("_");
    if((split[1] == Constants.LEAGUER_MALE_SUFFIX) || (split[1] == Constants.LEAGUER_FEMALE_SUFFIX)){
      wFDataWraper.isLeaguer = false;
    }else{
      wFDataWraper.isLeaguer = true;
    }
    wFDataWraper.leaguerId = leaguer.id;
    this.wfDataWraperMgr.setWFDataWraper(wFDataWraper);
  }

  /**
   * 组装已选提成
   * @param bonusItemData
   * @param bonusInfoMap
   * @param buserMap
   * @param clerkMap
   * @param roleMap
   * @returns {StaffData[]}
   */
  private getStaffList(bonusItemData:BonusItemData, bonusInfoMap:ZmMap<BonusInfo>,buserMap:ZmMap<BUser>,clerkMap:ZmMap<ClerkInfo>,roleMap:ZmMap<StoreAdminRole>) {
    let staffBonusList = new Array<StaffData>();
    let bonusId = this.getBonusId(bonusItemData);
    let bonusInfo = bonusInfoMap.get(bonusId);
    if (bonusInfo) {
      for (let index in bonusInfo.userBonusMap) {
        let userBonus: UserBonus = bonusInfo.userBonusMap[index];
        let staffData = new StaffData();
        staffData.id = userBonus.buserId;
        if (buserMap.get(userBonus.buserId) && buserMap.get(userBonus.buserId).name) {
          staffData.name = buserMap.get(userBonus.buserId).name;
        } else {
          staffData.name = "";
        }
        staffData.amount = userBonus.amount;
        staffData.bonusType = userBonus.bonusType;
        staffData.percentage = userBonus.percentage;
        staffData.cost = userBonus.cost;
        //服务人员角色
        if (clerkMap.get(userBonus.buserId) && clerkMap.get(userBonus.buserId).roleSet) {
          let roleSet = clerkMap.get(userBonus.buserId).roleSet;
          staffData.roleName = roleSet.map((roleId) => {
            let staffData = roleMap.get(roleId);
            if (staffData) {
              return staffData.name;
            }
          }).join("、");
        }
        staffBonusList.push(staffData);
      }
    }
    return staffBonusList;
  }

  /**
   * 组装预存划卡列表
   * @param preStoreCardRecordMap
   * @param leaguerPreStoreCardMap
   * @param productMap
   * @param goodsMap
   * @param packageMap
   * @param cardMap
   * @returns {ReduceItemData[]}
   */
  private getPreStoreCardRecords(preStoreCardRecordMap,leaguerPreStoreCardMap:ZmMap<PreStoreCard>,productMap:ZmMap<ProductInfo>,goodsMap:ZmMap<Goods>,packageMap:ZmMap<PackageProject>,cardMap:ZmMap<ProductCard>):Array<ReduceItemData>{
    let reduceList = new Array<ReduceItemData>();
    for(let index in preStoreCardRecordMap){
      let preStoreCardRecord:PreStoreCardRecord = preStoreCardRecordMap[index];
      let preStoreCard:PreStoreCard = leaguerPreStoreCardMap.get(preStoreCardRecord.preStoreCardId);
      if(preStoreCardRecord.itemType == ProductCardItemEnum.PRODUCT){
        let productInfo:ProductInfo = productMap.get(preStoreCardRecord.pgId);
        if(!AppUtils.isNullObj(productInfo)
          && !AppUtils.isNullObj(preStoreCard.leaguerPrdCardItems)){
          let reduceItemData = new ReduceItemData();
          reduceItemData.reductType = ReduceItemType.FromPreStoreCard;
          reduceItemData.type = BuyTypeEnum.PRODUCT;
          reduceItemData.itemType = ProductCardItemEnum.PRODUCT;
          reduceItemData.id = preStoreCardRecord.pgId;
          reduceItemData.name = productInfo.name;
          reduceItemData.price = productInfo.price;
          reduceItemData.count = preStoreCardRecord.count;
          for(let i=0;i<preStoreCard.leaguerPrdCardItems.length;i++){
            let leaguerPrdCardItem = preStoreCard.leaguerPrdCardItems[i];
            if(leaguerPrdCardItem.pgId == preStoreCardRecord.pgId){
              reduceItemData.restCount = leaguerPrdCardItem.restCount;
              reduceItemData.totalCount = leaguerPrdCardItem.count;
              break;
            }
          }
          reduceItemData.payType = PrdCardPayEnum.PrdCard;
          reduceItemData.leaguerCardId = preStoreCardRecord.preStoreCardId;
          reduceItemData.productCardName = "预存产品";
          reduceList.push(reduceItemData);
        }
      }else if(preStoreCardRecord.itemType == ProductCardItemEnum.GOODS){
        let goods:Goods = goodsMap.get(preStoreCardRecord.pgId);
        if(!AppUtils.isNullObj(goods)
          && !AppUtils.isNullObj(preStoreCard.leaguerPrdCardItems)){
          let reduceItemData = new ReduceItemData();
          reduceItemData.reductType = ReduceItemType.FromPreStoreCard;
          reduceItemData.type = BuyTypeEnum.GOODS;
          reduceItemData.itemType = ProductCardItemEnum.GOODS;
          reduceItemData.id = preStoreCardRecord.pgId;
          reduceItemData.name = goods.name;
          reduceItemData.price = goods.price;
          reduceItemData.count = preStoreCardRecord.count;
          for(let i=0;i<preStoreCard.leaguerPrdCardItems.length;i++){
            let leaguerPrdCardItem = preStoreCard.leaguerPrdCardItems[i];
            if(leaguerPrdCardItem.pgId == preStoreCardRecord.pgId){
              reduceItemData.restCount = leaguerPrdCardItem.restCount;
              reduceItemData.totalCount = leaguerPrdCardItem.count;
              break;
            }
          }
          reduceItemData.payType = PrdCardPayEnum.PrdCard;
          reduceItemData.leaguerCardId = preStoreCardRecord.preStoreCardId;
          reduceItemData.productCardName = "预存产品";
          reduceList.push(reduceItemData);
        }
      }else if(preStoreCardRecord.itemType == ProductCardItemEnum.PACKAGE){
        let packageProject:PackageProject = packageMap.get(preStoreCardRecord.pgId);
        if(!AppUtils.isNullObj(packageProject)
          && !AppUtils.isNullObj(preStoreCard.leaguerPrdCardItems)){
          let reduceItemData = new ReduceItemData();
          reduceItemData.reductType = ReduceItemType.FromPreStoreCard;
          reduceItemData.type = BuyTypeEnum.PACKAGE;
          reduceItemData.itemType = ProductCardItemEnum.PACKAGE;
          reduceItemData.id = preStoreCardRecord.pgId;
          reduceItemData.name = packageProject.name;
          reduceItemData.price = packageProject.sellPrice;
          reduceItemData.count = preStoreCardRecord.count;
          for(let i=0;i<preStoreCard.leaguerPrdCardItems.length;i++){
            let leaguerPrdCardItem = preStoreCard.leaguerPrdCardItems[i];
            if(leaguerPrdCardItem.pgId == preStoreCardRecord.pgId){
              reduceItemData.restCount = leaguerPrdCardItem.restCount;
              reduceItemData.totalCount = leaguerPrdCardItem.count;
              break;
            }
          }
          reduceItemData.payType = PrdCardPayEnum.PrdCard;
          reduceItemData.leaguerCardId = preStoreCardRecord.preStoreCardId;
          reduceItemData.productCardName = "预存产品";
          reduceList.push(reduceItemData);
        }
      }

    }
    return reduceList;

  }

  /**
   * 组装次卡划卡项
   * @param delimitCardRecordMap
   * @param leaguerProductCardMap
   * @param productMap
   * @param goodsMap
   * @param packageMap
   * @param cardMap
   * @returns {ReduceItemData[]}
   */
  private getDelimitCardRecords(delimitCardRecordMap,leaguerProductCardMap:ZmMap<LeaguerProductCard>,productMap:ZmMap<ProductInfo>,goodsMap:ZmMap<Goods>,packageMap:ZmMap<PackageProject>,cardMap:ZmMap<ProductCard>):Array<ReduceItemData>{
    let reduceList = new Array<ReduceItemData>();
    for(let index in delimitCardRecordMap){
      let delimitCardRecord:DelimitCardRecord = delimitCardRecordMap[index];
      let leaguerProductCard:LeaguerProductCard = leaguerProductCardMap.get(delimitCardRecord.leaguerPrdCardId);
      let productCard:ProductCard = leaguerProductCard?cardMap.get(leaguerProductCard.cardId):null;
      if(delimitCardRecord.itemType == ProductCardItemEnum.PRODUCT){
        let productInfo:ProductInfo = productMap.get(delimitCardRecord.pgId);
        if(!AppUtils.isNullObj(productInfo)
          && !AppUtils.isNullObj(leaguerProductCard.leaguerPrdCardItems)){
          let reduceItemData = new ReduceItemData();
          reduceItemData.type = BuyTypeEnum.PRODUCT;
          reduceItemData.itemType = ProductCardItemEnum.PRODUCT;
          reduceItemData.id = delimitCardRecord.pgId;
          reduceItemData.name = productInfo.name;
          reduceItemData.price = productInfo.price;
          reduceItemData.count = delimitCardRecord.count;
          for(let i=0;i<leaguerProductCard.leaguerPrdCardItems.length;i++){
            let leaguerPrdCardItem = leaguerProductCard.leaguerPrdCardItems[i];
            if(leaguerPrdCardItem.pgId == delimitCardRecord.pgId){
              reduceItemData.restCount = leaguerPrdCardItem.restCount;
              reduceItemData.totalCount = leaguerPrdCardItem.count;
              break
            }
          }
          reduceItemData.payType = PrdCardPayEnum.PrdCard;
          reduceItemData.leaguerCardId = delimitCardRecord.leaguerPrdCardId;
          reduceItemData.productCardName = productCard?productCard.name:'-';
          reduceList.push(reduceItemData);
        }
      }else if(delimitCardRecord.itemType == ProductCardItemEnum.GOODS){
        let goods:Goods = goodsMap.get(delimitCardRecord.pgId);
        if(!AppUtils.isNullObj(goods)
          && !AppUtils.isNullObj(leaguerProductCard.leaguerPrdCardItems)){
          let reduceItemData = new ReduceItemData();
          reduceItemData.type = BuyTypeEnum.GOODS;
          reduceItemData.itemType = ProductCardItemEnum.GOODS;
          reduceItemData.id = delimitCardRecord.pgId;
          reduceItemData.name = goods.name;
          reduceItemData.price = goods.price;
          reduceItemData.count = delimitCardRecord.count;
          for(let i=0;i<leaguerProductCard.leaguerPrdCardItems.length;i++){
            let leaguerPrdCardItem = leaguerProductCard.leaguerPrdCardItems[i];
            if(leaguerPrdCardItem.pgId == delimitCardRecord.pgId){
              reduceItemData.restCount = leaguerPrdCardItem.restCount;
              reduceItemData.totalCount = leaguerPrdCardItem.count;
              break
            }
          }
          reduceItemData.payType = PrdCardPayEnum.PrdCard;
          reduceItemData.leaguerCardId = delimitCardRecord.leaguerPrdCardId;
          reduceItemData.productCardName = productCard?productCard.name:'-';
          reduceList.push(reduceItemData);
        }
      }else if(delimitCardRecord.itemType == ProductCardItemEnum.PACKAGE){
        let packageProject:PackageProject = packageMap.get(delimitCardRecord.pgId);
        if(!AppUtils.isNullObj(packageProject)
          && !AppUtils.isNullObj(leaguerProductCard.leaguerPrdCardItems)){
          let reduceItemData = new ReduceItemData();
          reduceItemData.type = BuyTypeEnum.PACKAGE;
          reduceItemData.itemType = ProductCardItemEnum.PACKAGE;
          reduceItemData.id = delimitCardRecord.pgId;
          reduceItemData.name = packageProject.name;
          reduceItemData.price = packageProject.sellPrice;
          reduceItemData.count = delimitCardRecord.count;
          for(let i=0;i<leaguerProductCard.leaguerPrdCardItems.length;i++){
            let leaguerPrdCardItem = leaguerProductCard.leaguerPrdCardItems[i];
            if(leaguerPrdCardItem.pgId == delimitCardRecord.pgId){
              reduceItemData.restCount = leaguerPrdCardItem.restCount;
              reduceItemData.totalCount = leaguerPrdCardItem.count;
              break
            }
          }
          reduceItemData.payType = PrdCardPayEnum.PrdCard;
          reduceItemData.leaguerCardId = delimitCardRecord.leaguerPrdCardId;
          reduceItemData.productCardName = productCard?productCard.name:'-';
          reduceList.push(reduceItemData);
        }
      }

    }
    return reduceList;
  }

  /**
   * 组装已选套餐列表
   * @param packageRecordMap
   * @param packageProjectMap
   * @returns {PackageItemData[]}
   */
  private getPackageList(packageRecordMap,packageProjectMap:ZmMap<PackageProject>):Array<PackageItemData>{
    let packageList = new Array<PackageItemData>();
    for(let index in packageRecordMap){
      let packageRecord:PackagePrjRecord = packageRecordMap[index];
      let packageProject:PackageProject = packageProjectMap.get(packageRecord.packagePrjId);
      if(packageProject){
        let packageItemData = new PackageItemData();
        packageItemData.type = BuyTypeEnum.PACKAGE;
        packageItemData.id = packageProject.id;
        packageItemData.name = packageProject.name;
        packageItemData.oldPrice = packageRecord.oldPrice;
        packageItemData.price = packageRecord.price;
        packageItemData.count = packageRecord.count;
        packageItemData.discount = packageRecord.discount;
        packageItemData.totalPrice = packageRecord.cost;
        packageItemData.cost = packageRecord.pay;
        packageItemData.payType = packageRecord.recordType == RecordTypeEnum.Buy?PrdCardPayEnum.CashPay:PrdCardPayEnum.Donation;
        packageItemData.recordType = packageRecord.recordType;//RecordTypeEnum
        packageItemData.restCount = packageRecord.restCount;//预存数量
        packageList.push(packageItemData);
      }
    }
    return packageList;
  }

  /**
   * 组装已选次卡列表
   * @param prdCardRecordMap
   * @param storeCardInfo
   * @returns {CardItemData[]}
   */
  private getCardList(prdCardRecordMap, productCardMap: ZmMap<ProductCard>):Array<CardItemData> {
    let cardList = new Array<CardItemData>();
    for (let index in prdCardRecordMap) {
      let prdCardRecord: PrdCardRecord = prdCardRecordMap[index];
      let productCard: ProductCard = productCardMap.get(prdCardRecord.prdCardTypeId);
      if(productCard){
        let cardItemData = new CardItemData();
        cardItemData.type = BuyTypeEnum.PRDCARD;
        cardItemData.id = productCard.id;
        cardItemData.name = productCard.name;
        cardItemData.oldPrice = prdCardRecord.oldPrice;
        cardItemData.price = prdCardRecord.price;
        cardItemData.count = prdCardRecord.count;
        cardItemData.discount = prdCardRecord.discount;
        cardItemData.totalPrice = prdCardRecord.cost;
        cardItemData.cost = prdCardRecord.pay;
        cardItemData.payType = prdCardRecord.recordType == RecordTypeEnum.Buy?PrdCardPayEnum.CashPay:PrdCardPayEnum.Donation;
        cardItemData.recordType = prdCardRecord.recordType;//RecordTypeEnum
        cardList.push(cardItemData);
      }
    }
    return cardList;
  }

  /**
   * 组装已选商品列表
   * @param goodsRecordMap
   * @param storeGoods
   * @returns {GoodsItemData[]}
   */
  private getGoodsList(goodsRecordMap, goodsMap: ZmMap<Goods>):Array<GoodsItemData> {
    let goodsList = new Array<GoodsItemData>();
    for (let index in goodsRecordMap) {
      let goodsRecord: GoodsRecord = goodsRecordMap[index];
      let goods = goodsMap.get(goodsRecord.goodsId);
      if (goods) {
        let goodsItemData = new GoodsItemData();
        goodsItemData.type = BuyTypeEnum.GOODS;
        goodsItemData.id = goods.id.toString();
        goodsItemData.name = goods.name;
        goodsItemData.oldPrice = goodsRecord.oldPrice;
        goodsItemData.price = goodsRecord.price;
        goodsItemData.count = goodsRecord.count;
        goodsItemData.discount = goodsRecord.discount;
        goodsItemData.totalPrice = goodsRecord.cost;
        goodsItemData.cost = goodsRecord.pay;
        goodsItemData.payType = goodsRecord.recordType == RecordTypeEnum.Buy?PrdCardPayEnum.CashPay:PrdCardPayEnum.Donation;
        goodsItemData.recordType = goodsRecord.recordType;//RecordTypeEnum
        goodsItemData.restCount = goodsRecord.restCount;//预存数量
        goodsList.push(goodsItemData);
      }
    }
    return goodsList;
  }

  /**
   * 组装已选划卡项目
   * @param decreasePrdCardRecordMap
   * @param storeProductInfo
   * @returns {ProductItemData[]}
   */
  private getCardProductList(decreasePrdCardRecordMap, productMap: ZmMap<ProductInfo>, prdCardMap:ZmMap<ProductCard>,leaguerDetail:LeaguerDetail):Array<ProductItemData> {
    let productList = new Array<ProductItemData>();
      for (let index in decreasePrdCardRecordMap) {
        let decreasePrdCardRecord: DecreasePrdCardRecord = decreasePrdCardRecordMap[index];
        let product = productMap.get(decreasePrdCardRecord.prdId);
        let productItemData = new ProductItemData();
        productItemData.type = BuyTypeEnum.PRODUCT;
        productItemData.id = product.id.toString();
        productItemData.name = product.name;
        productItemData.price = product.price;
        productItemData.count = decreasePrdCardRecord.count;
        productItemData.discount = decreasePrdCardRecord.discount;
        productItemData.totalPrice = 0;
        productItemData.cost = 0;
        productItemData.payType = 1;//划卡

        // productItemData.status = DecreasePrdCardRecordStatusEnum.OWNERCARD;//新购0 已购1
        productItemData.productCardId = decreasePrdCardRecord.cardTypeId;//划卡项目对应次卡id
        let leaguerProductCard = leaguerDetail.getLeaguerProductCardMap().get(decreasePrdCardRecord.cardTypeId);
        productItemData.productCardName = prdCardMap.get(leaguerProductCard.cardId)?prdCardMap.get(leaguerProductCard.cardId).name:"";//划卡项目对应次卡name

        productList.push(productItemData);
      }
    return productList;
  }

  /**
   * 组装已选项目列表
   * @param prodRecordMap
   * @param storeProductInfo
   * @returns {ProductItemData[]}
   */
  private getProdRecordList(prodRecordMap, productMap: ZmMap<ProductInfo>):Array<ProductItemData> {
    let productList = new Array<ProductItemData>();
      for (let index in prodRecordMap) {
        let prodRecord: ProdRecord = prodRecordMap[index];
        let product = productMap.get(prodRecord.prodId);
        if (product) {
          let productItemData = new ProductItemData();
          productItemData.type = BuyTypeEnum.PRODUCT;
          productItemData.id = product.id.toString();
          productItemData.name = product.name;
          productItemData.oldPrice = prodRecord.oldPrice;
          productItemData.price = prodRecord.price;
          productItemData.count = prodRecord.count;
          productItemData.discount = prodRecord.discount;
          productItemData.totalPrice = prodRecord.cost;
          productItemData.cost = prodRecord.pay;
          productItemData.payType = prodRecord.recordType == RecordTypeEnum.Buy?PrdCardPayEnum.CashPay:PrdCardPayEnum.Donation;
          productItemData.recordType = prodRecord.recordType;//RecordTypeEnum
          productItemData.restCount = prodRecord.restCount;//预存数量
          productList.push(productItemData);
        }
      }
    return productList;
  }

  /**
   * 组装员工详情
   * @param buserList
   * @param viewDataTmp
   */
  private buildBuserMap(buserList: Array<BUser>) {
    let buserMap = new ZmMap<BUser>();
    for (let i = 0; i < buserList.length; i++) {
      buserMap.put(buserList[i].id, buserList[i]);
    }
    return buserMap;
  }

  /**
   * 获取提成id
   * @param bonusItemData
   * @returns {string}
   */
  private getBonusId(bonusItemData:BonusItemData) {
    return AppUtils.format("{0}_{1}_{2}_{3}", bonusItemData.payType, bonusItemData.type, bonusItemData.id, bonusItemData.productCardId);
  }

}

export class ConsumeViewData{
  public workFlowType:WorkFlowType;
  public bonusInfoMap: ZmMap<BonusInfo>;
  public number:string;

  //数据回填准备数据
  public clerkMap: ZmMap<ClerkInfo>;
  public roleMap: ZmMap<StoreAdminRole>;
  public buserMap: ZmMap<BUser>;

}




