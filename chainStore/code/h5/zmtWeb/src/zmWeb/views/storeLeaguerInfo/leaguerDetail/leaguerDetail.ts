import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {ActivatedRoute} from "@angular/router";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreLeaguerInfoViewDataMgr} from "../StoreLeaguerInfoViewDataMgr";
import {StoreCardInfo} from "../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {OrderMgr} from "../../../bsModule/order/OrderMgr";
import {OrderQueryForm} from "../../../bsModule/order/apiData/OrderQueryForm";
import {Order} from "../../../bsModule/order/data/Order";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {LeaguerProductCard} from "../../../bsModule/storeLeaguerInfo/data/LeaguerProductCard";
import {OrderTypeEnum} from "../../../bsModule/order/data/OrderTypeEnum";
import {CustomerTypeEnum} from "../../../bsModule/storeLeaguerInfo/data/CustomerTypeEnum";
import {AppRouter} from "../../../comModule/AppRouter";
import {PageResp} from "../../../comModule/PageResp";
import {AppCfg} from "../../../comModule/AppCfg";
import {LeaguerDetailSynDataHolder} from "../../../bsModule/leaguerDetail/LeaguerDetailSynDataHolder";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {LeaguerRecordMgr} from "../../../bsModule/leaguerRecord/LeaguerRecordMgr";
import {LeaguerRecordQueryForm} from "../../../bsModule/leaguerRecord/apiData/LeaguerRecordQueryForm";
import {LeaguerRecord} from "../../../bsModule/leaguerRecord/data/LeaguerRecord";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {StoreLeaguerInfo} from "../../../bsModule/storeLeaguerInfo/data/StoreLeaguerInfo";
import {LeaguerLabel} from "../../../bsModule/storeLeaguerInfo/data/LeaguerLabel";
import {StoreConfigSynDataHolder} from "../../../bsModule/storeConfig/StoreConfigSynDataHolder";
import {StoreConfig} from "../../../bsModule/storeConfig/data/StoreConfig";
import {LeaguerConfig} from "../../../bsModule/storeConfig/data/LeaguerConfig";
import {SysInitLeaguerTypeEnum} from "../../../bsModule/storeConfig/data/leaguer/SysInitLeaguerTypeEnum";
import {Constants} from "../../common/Util/Constants";
import {LeaguerOriginConfig} from "../../../bsModule/storeConfig/data/leaguer/LeaguerOriginConfig";
import {TabItem} from "../../zmComp/tab/ZmTabs";
import {LeaguerExpandAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerExpandAttribute";
import {Popup} from "../../common/popup/popup";
import {LeaguerAttributeStateEnum} from "../../../bsModule/storeConfig/data/leaguer/LeaguerAttributeStateEnum";
import {ProductCardDetailCacheDataHolder} from "../../../bsModule/productCardDetail/productCardDetailCacheDataHolder";
import {ProductCardDetail} from "../../../bsModule/productCardDetail/data/ProductCardDetail";
import {ProductCardItem} from "../../../bsModule/productCardDetail/data/ProductCardItem";
import {ProductCardItemEnum} from "../../../bsModule/productCardDetail/data/ProductCardItemEnum";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {PrdCardType} from "../../../bsModule/storeCardInfo/data/PrdCardType";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StorePackageProjectSynDataHolder} from "../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {StorePackageProject} from "../../../bsModule/storePackageProject/data/StorePackageProject";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {PreStoreCard} from "../../../bsModule/leaguerDetail/data/PreStoreCard";
import {LeaguerPrdCardItem} from "../../../bsModule/storeLeaguerInfo/data/LeaguerPrdCardItem";

/**
 * 会员管理 会员详情
 */
@Component({
  selector:'leaguer-detail',
  templateUrl:'leaguerDetail.html',
  styleUrls:['leaguerDetail.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class LeaguerDetailPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private paramSub: any;
  private service: LeaguerDetailService;
  public viewData: LeaguerDetailViewData;
  private leaguerId:string;
  public defaultTab:number = 0;

  constructor(private leaguerDetailSynDataHolder:LeaguerDetailSynDataHolder,
              private storeLeaguerInfoSynDataHolder:StoreLeaguerInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private orderMgr:OrderMgr,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
              private storePackageProjectSynDataHolder:StorePackageProjectSynDataHolder,
              private leaguerRecordMgr:LeaguerRecordMgr,
              private storeConfigSynDataHolder:StoreConfigSynDataHolder,
              private productCardDetailCacheDataHolder:ProductCardDetailCacheDataHolder,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private route:ActivatedRoute){

    this.service = new LeaguerDetailService(
      this.leaguerDetailSynDataHolder,
      this.storeLeaguerInfoSynDataHolder,
      this.buserMgr,
      this.storeCardInfoSynDataHolder,
      this.orderMgr,
      this.storeProductInfoSynDataHolder,
      this.storeGoodsSynDataHolder,
      this.storePackageProjectSynDataHolder,
      this.leaguerRecordMgr,
      this.storeConfigSynDataHolder,
      this.productCardDetailCacheDataHolder,
      this.storeLeaguerInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeLeaguerInfoViewDataMgr.subscribeLeaguerDetailVD((viewDataP:LeaguerDetailViewData) => {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
    });
    this.paramSub = this.route.params.subscribe(params =>{
      this.leaguerId = params['leaguerId'];
      this.defaultTab = params['tabIndex'];
      this.service.initViewData(this.leaguerId);
    })
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 切换tab页签事件
   * @param tab
   */
  switchTab(tab:TabItem){
    //todo
    // let index = LeaguerDetailTabs.indexOf(tab.name);
  }

  /**
   * 跳转新建记录 点击事件
   */
  goAddRecord(){
    AppRouter.goAddRecord(this.leaguerId);
  }

  /**
   * 跳转编辑跟进记录
   * @param leaguerRecordId
   */
  goEditRecordInfo(leaguerRecordId:string){
    AppRouter.goEditRecord(leaguerRecordId);
  }

  /**
   * 跳转跟进记录详情
   * @param leaguerRecordId
   */
  goRecordDetail(leaguerRecordId:string){
    AppRouter.goRecordDetail(leaguerRecordId);
  }

  /**
   * 删除跟进记录
   */
  deleteRecordInfo(leaguerRecordId:string){
    let tips = "删除后将无法恢复，是否确定删除";
    Popup.getInstance().open("删除跟进记录",tips,()=>{
      this.service.deleteLeaguerRecord(leaguerRecordId).then((success:boolean)=>{
        if(success){
          AppUtils.showSuccess("提示","删除成功");
          this.service.initViewData(this.leaguerId);
        }else{
          AppUtils.showError("提示","删除失败");
        }
      })
    })
  }

  /**
   * 获取跟进记录关联项目
   * @param prdIds
   */
  getRelateProduct(recordId:string):Array<string>{
    return this.viewData.relatePrdMap.get(recordId);
  }

  /**
   * 页面点击事件 跳转次卡详情
   * @param cardId
   */
  goProductCardDetail(cardId){
    if(!AppUtils.isNullOrWhiteSpace(cardId)){
      AppRouter.goProductCardDetail(cardId);
    }
  }

  /**
   * 页面点击事件 跳转订单详情页面
   * @param order
   */
  goOrderDetail(order:Order){
    if(order.orderType == OrderTypeEnum.PURCHASE){
      AppRouter.goOrderConsumeDetail(order.id);
    }else if(order.orderType == OrderTypeEnum.RECHARGE){
      AppRouter.goOrderRechargeDetail(order.id);
    }
  }

  /**
   * 页面点击事件 跳转修改提成页面
   * @param order
   */
  goEditBonus(order:Order){
    if(order.orderType == OrderTypeEnum.PURCHASE){
      AppRouter.goEditConsumeBonus(order.id);
    }else if(order.orderType == OrderTypeEnum.RECHARGE){
      AppRouter.goEditRechargeBonus(order.id);
    }
  }

  /**
   * 页面点击事件 选择时间今天、昨天、七天
   * @param index
   */
  chooseConsumeTime(index){
    switch (index){
      case 0:
        this.setTodayTime();
        break;
      case 1:
        this.setYesterdayTime();
        break;
      case 2:
        this.setLastWeekTime();
        break;
    }
  }

  /**
   * 页面点击事件 今天
   */
  setTodayTime(){
    let date = new Date();
    this.viewData.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.viewData.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.findOrders();
  }

  /**
   * 页面点击事件 昨日
   */
  setYesterdayTime(){
    let nowDate = new Date();
    let yesterdayTime = nowDate.getTime() - 1000*60*60*24;
    let date = new Date(yesterdayTime);
    this.viewData.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.viewData.maxTime = {year: nowDate.getFullYear(), month: nowDate.getMonth() + 1, day: date.getDate()};
    this.findOrders();
  }

  /**
   * 页面点击事件 近7天
   */
  setLastWeekTime(){
    let nowDate = new Date();
    let lastWeekTime = nowDate.getTime() - 1000*60*60*24*7;
    let date = new Date(lastWeekTime);
    this.viewData.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.viewData.maxTime = {year: nowDate.getFullYear(), month: nowDate.getMonth() + 1, day: nowDate.getDate()};
    this.findOrders();
  }

  /**
   * 页面点击事件 查询订单
   */
  findOrders(){
    this.service.getPageData(1,this.viewData);
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    this.service.getPageData(curPage,this.viewData);
  }

  /**
   * 次卡分页过滤数据
   */
  getCardPageData(curPage){
    let data = this.viewData.prdCardDataList;
    let  pageData = AppUtils.getPageData(curPage,data);
    this.viewData.prdCardDataListTmp = pageData;
  }

  /**
   * 项目分页过滤数据
   */
  getProductPageData(curPage){
    let data = this.viewData.productDataList;
    let  pageData = AppUtils.getPageData(curPage,data);
    this.viewData.productDataListTmp = pageData;
  }

  /**
   * 跟进记录分页过滤数据
   */
  getLeaguerRecordPageData(curPage){
    this.service.getLeaguerRecordPageData(curPage,this.viewData);
  }

  goLeaguer(){
    AppRouter.goFindLeaguer();
  }

  /**
   * 判断 orderId 是否有效
   *
   * @param {string} orderId
   * @returns {boolean}
   */
  orderIdIsValid(orderId: string): boolean{
    if(AppUtils.isNullObj(orderId))return false;
    try {
      return parseInt(orderId) > 0
    } catch (e) {
      console.log("orderId is not a number ",orderId);
    }
    return false;
  }

}

export class LeaguerDetailService{
  constructor(private leaguerDetailSynDataHolder:LeaguerDetailSynDataHolder,
              private storeLeaguerInfoSynDataHolder:StoreLeaguerInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private orderMgr:OrderMgr,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
              private storePackageProjectSynDataHolder:StorePackageProjectSynDataHolder,
              private leaguerRecordMgr:LeaguerRecordMgr,
              private storeConfigSynDataHolder:StoreConfigSynDataHolder,
              private productCardDetailCacheDataHolder:ProductCardDetailCacheDataHolder,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr){}

  public initViewData(leaguerId):void{
    let viewDataTmp = new LeaguerDetailViewData();
    this.storeLeaguerInfoViewDataMgr.setLeaguerDetailViewData(viewDataTmp);

    this.buildViewData(leaguerId,(viewDataP:LeaguerDetailViewData) =>{
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP:LeaguerDetailViewData){
    this.storeLeaguerInfoViewDataMgr.setLeaguerDetailViewData(viewDataP);
  }

  public async buildViewData(leaguerId,callback:(viewDataP:LeaguerDetailViewData) => void){
    let viewDataTmp = new LeaguerDetailViewData();
    //请求店铺所有会员
    let storeId = SessionUtil.getInstance().getStoreId();
    let leaguerDetail:LeaguerDetail = await this.leaguerDetailSynDataHolder.getData(leaguerId);
    if(!AppUtils.isNullObj(leaguerDetail)){
      viewDataTmp.leaguer = leaguerDetail.encryptLeaguerDetail4New();
      //会员头像
      if(!AppUtils.isNullOrWhiteSpace(viewDataTmp.leaguer.headImg)){
        viewDataTmp.headImg = AppCfg.getInstance().getImgPreUrl()+viewDataTmp.leaguer.headImg;
      }
      //会员标签
      let storeLeaguerInfo:StoreLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
      if(!AppUtils.isNullObj(storeLeaguerInfo)){
        let validLeaguerLabelMap = storeLeaguerInfo.getValidLeaguerLabelMap();
        viewDataTmp.leaguer.labelIds = viewDataTmp.leaguer.labelIds?viewDataTmp.leaguer.labelIds:new Array<string>();
        viewDataTmp.leaguer.labelIds.forEach((id:string)=>{
          if(!AppUtils.isNullObj(validLeaguerLabelMap.get(id))){
            viewDataTmp.labelList.push(validLeaguerLabelMap.get(id));
          }
        })
      }
      //会员扩展属性、来源
      if(!AppUtils.isNullObj(viewDataTmp.leaguer.expandAttrMap) || !AppUtils.isNullObj(viewDataTmp.leaguer.originId)){
        let storeConfig:StoreConfig = await this.storeConfigSynDataHolder.getData(storeId);
        if(!AppUtils.isNullObj(storeConfig)){
          let leaguerConfigTmp = new LeaguerConfig();
          AppUtils.copy(leaguerConfigTmp, storeConfig.leaguerConfig);
          viewDataTmp.expandAttrList = this.getExpandAttrList(leaguerConfigTmp, viewDataTmp.leaguer);
          viewDataTmp.leaguerOriginConfigMap = leaguerConfigTmp.getLeaguerOriginMap();
        }
      }
      //请求服务人员信息
      if(viewDataTmp.leaguer.buserIds){
        let buserIds = viewDataTmp.leaguer.buserIds;
        let buserList = await this.buserMgr.findByMultitId(buserIds);
        viewDataTmp.buserNames = this.getLeaguerStaffName(buserList, buserIds);
      }else{
        viewDataTmp.buserNames = "-";
      }

      //请求会员对应会员卡信息
      let storeCardInfo:StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
      if(!AppUtils.isNullObj(storeCardInfo)){
        if(viewDataTmp.leaguer.leaguerMemberCard && viewDataTmp.leaguer.leaguerMemberCard.cardId){
          viewDataTmp.membershipCard = storeCardInfo.getMemberCardMap().get(viewDataTmp.leaguer.leaguerMemberCard.cardId);
        }
        //次卡类型列表
        viewDataTmp.prdCardMap = storeCardInfo.getProductCardMap();
        viewDataTmp.prdCardTypeMap = storeCardInfo.getAllProductCardTypeMap();
      }

      //请求项目信息
      let storeProductInfo:StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
      if(!AppUtils.isNullObj(storeProductInfo)){
        viewDataTmp.prdInfoMap = storeProductInfo.getAllProductInfoMap();
      }

      //会员相关次卡 次卡管理
      if(viewDataTmp.leaguer.leaguerProductCardMap){
        let storeGoods:StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
        let storePackageProject:StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
        let storeCardInfo:StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
        let productCardMap = storeCardInfo.getProductCardMap()?storeCardInfo.getProductCardMap():new ZmMap<ProductCard>();
        viewDataTmp.prdCardDataList = this.getPrdCardDataList(viewDataTmp.leaguer.leaguerProductCardMap,viewDataTmp.prdInfoMap,storeGoods.getAllGoodsMap(),storePackageProject.getAllPackageProjectMap(),viewDataTmp.prdCardTypeMap,productCardMap);
        viewDataTmp.prdCardDataListTmp = AppUtils.getPageData(1,viewDataTmp.prdCardDataList);
        viewDataTmp.cardPage = 1;
        viewDataTmp.cardRecordCount = viewDataTmp.prdCardDataList.length;
      }

      //会员预存
      if(viewDataTmp.leaguer.leaguerPreStoreCardMap){
        //店铺商品
        let storeGoods:StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
        let allGoodsMap = storeGoods?storeGoods.getAllGoodsMap():new ZmMap<Goods>();
        //店铺套餐
        let storePackageProject:StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
        let allPackageProjectMap = storePackageProject?storePackageProject.getAllPackageProjectMap():new ZmMap<PackageProject>();
        viewDataTmp.productDataList = this.getPreStoreCardList(viewDataTmp.leaguer.getPreStoreCardMap(),viewDataTmp.prdInfoMap,allGoodsMap,allPackageProjectMap);
        viewDataTmp.productDataListTmp = AppUtils.getPageData(1,viewDataTmp.productDataList);
        viewDataTmp.productPage = 1;
        viewDataTmp.productRecordCount = viewDataTmp.productDataList.length;
      }

      //请求会员相关订单
      viewDataTmp.orderQueryForm.storeId = storeId;
      viewDataTmp.orderQueryForm.leaguerId = leaguerId;
      viewDataTmp.orderQueryForm.pageItemCount = 10;
      viewDataTmp.orderQueryForm.pageNo = 1;
      viewDataTmp.orderQueryForm.minTime = AppUtils.getMinTime(viewDataTmp.minTime);
      viewDataTmp.orderQueryForm.maxTime = AppUtils.getMaxTime(viewDataTmp.maxTime);
      let pageResp:PageResp = await this.orderMgr.findOrderPageInfo(viewDataTmp.orderQueryForm);
      if(!AppUtils.isNullObj(pageResp)){
        viewDataTmp.page = 1;
        viewDataTmp.recordCount = pageResp.totalCount;
        viewDataTmp.orderList = pageResp.list;
      }

      //会员跟进记录
      viewDataTmp.leaguerRecordQueryForm.storeId = storeId;
      viewDataTmp.leaguerRecordQueryForm.leaguerId = leaguerId;
      viewDataTmp.leaguerRecordQueryForm.pageItemCount = 10;
      viewDataTmp.leaguerRecordQueryForm.pageNo = 1;
      let leaguerRecordPageResp:PageResp = await this.leaguerRecordMgr.getLeaguerRecordPageInfo(viewDataTmp.leaguerRecordQueryForm);
      viewDataTmp.leaguerRecordPage = 1;
      viewDataTmp.leaguerRecordCount = leaguerRecordPageResp.totalCount;
      viewDataTmp.leaguerRecordList = leaguerRecordPageResp.list;
      viewDataTmp.relatePrdMap = this.getRecordRelateProductMap(viewDataTmp.leaguerRecordList,viewDataTmp.prdInfoMap);
    }else{
      AppUtils.showError("提示","数据加载失败");
    }
    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  /**
   * 组装跟进记录关联项目
   * @param leaguerRecordList
   * @param prdInfoMap
   * @returns {ZmMap<Array<string>>}
   */
  private getRecordRelateProductMap(leaguerRecordList,prdInfoMap):ZmMap<Array<string>> {
    let relatePrdMap = new ZmMap<Array<string>>();
    leaguerRecordList.forEach((record) => {
      if (!AppUtils.isNullObj(record.relateProduct) && !AppUtils.isNullObj(record.relateProduct.prdIds) && record.relateProduct.prdIds.length > 0) {
        let relatePrdArr = new Array<string>();
        if (!AppUtils.isNullObj(prdInfoMap)) {
          record.relateProduct.prdIds.forEach((id) => {
            let productInfo = prdInfoMap.get(id);
            if (!AppUtils.isNullObj(productInfo)) {
              relatePrdArr.push(productInfo.name);
            }
          })
        }
        relatePrdMap.put(record.id, relatePrdArr);
      }
    })
    return relatePrdMap;
  }

  /**
   * 获取扩展属性
   * @param leaguerConfigTmp
   * @param leaguer
   * @returns {ExpandAttrLabelValue[]}
   */
  private getExpandAttrList(leaguerConfigTmp: LeaguerConfig,leaguer:LeaguerDetail):Array<ExpandAttrLabelValue> {
    let leaguerExpandAttributeMap = leaguerConfigTmp.getLeaguerExpandAttributeMap();
    let expandAttributeMap = leaguer.getExpandAttributeMap();
    let leaguerExpandAttributeList = leaguerExpandAttributeMap.values().filter((item:LeaguerExpandAttribute)=>{
      if(item.status == LeaguerAttributeStateEnum.Enable){
        return true;
      }else{
        return false;
      }
    })
    let expandAttrList = leaguerExpandAttributeList.map((item:LeaguerExpandAttribute)=>{
      let expandAttrLabelValue = new ExpandAttrLabelValue();
      expandAttrLabelValue.label = item.label;
      expandAttrLabelValue.value = expandAttributeMap.get(item.id);
      return expandAttrLabelValue;
    })
    return expandAttrList;
  }

  /**
   * 获取订单分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getPageData(curPage:number,viewData:LeaguerDetailViewData){
    viewData.loadingFinish = false;
    viewData.orderList = [];
    //请求会员订单
    let storeId = SessionUtil.getInstance().getStoreId();
    viewData.orderQueryForm.storeId = storeId;
    viewData.orderQueryForm.leaguerId = viewData.leaguer.id;
    viewData.orderQueryForm.pageItemCount = 10;
    viewData.orderQueryForm.pageNo = curPage;
    viewData.orderQueryForm.minTime = AppUtils.getMinTime(viewData.minTime);
    viewData.orderQueryForm.maxTime = AppUtils.getMaxTime(viewData.maxTime);
    let pageResp:PageResp = await this.orderMgr.findOrderPageInfo(viewData.orderQueryForm);
    viewData.page = curPage;
    viewData.recordCount = pageResp.totalCount;
    viewData.orderList = pageResp.list;

    viewData.loadingFinish = true;
    this.handleViewData(viewData);
  }

  /**
   * 获取跟进记录分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getLeaguerRecordPageData(curPage:number,viewData:LeaguerDetailViewData){
    viewData.loadingFinish = false;
    viewData.leaguerRecordList = [];
    //请求会员订单
    let storeId = SessionUtil.getInstance().getStoreId();
    viewData.leaguerRecordQueryForm.storeId = storeId;
    viewData.leaguerRecordQueryForm.leaguerId = viewData.leaguer.id;
    viewData.leaguerRecordQueryForm.pageItemCount = 10;
    viewData.leaguerRecordQueryForm.pageNo = curPage;
    let leaguerRecordPageResp:PageResp = await this.leaguerRecordMgr.getLeaguerRecordPageInfo(viewData.leaguerRecordQueryForm);
    viewData.leaguerRecordPage = curPage;
    viewData.leaguerRecordCount = leaguerRecordPageResp.totalCount;
    viewData.leaguerRecordList = leaguerRecordPageResp.list;

    viewData.loadingFinish = true;
    this.handleViewData(viewData);
  }

  /**
   * 从会员预存遍历组装划卡列表
   * @param preStoreCardMap
   * @param allProductMap
   * @param allGoodsMap
   * @param allPackageProjectMap
   * @returns {PreStoreCardItem[]}
   */
  private getPreStoreCardList(preStoreCardMap: ZmMap<PreStoreCard>, allProductMap: ZmMap<ProductInfo>, allGoodsMap: ZmMap<Goods>, allPackageProjectMap: ZmMap<PackageProject>):Array<PreStoreCardItem> {
    let preStoreCardItemList = new Array<PreStoreCardItem>();
    let preStoreCardList = preStoreCardMap.values();
    for (let i = 0; i < preStoreCardList.length; i++) {
      let preStoreCard = preStoreCardList[i];
      for (let j = 0; j < preStoreCard.leaguerPrdCardItems.length; j++) {
        let leaguerPrdCardItem = preStoreCard.leaguerPrdCardItems[j];
        let preStoreCardItem = new PreStoreCardItem();
        preStoreCardItem.type = leaguerPrdCardItem.itemType;
        preStoreCardItem.id = leaguerPrdCardItem.pgId;
        preStoreCardItem.restCount = leaguerPrdCardItem.restCount;
        preStoreCardItem.count = leaguerPrdCardItem.count;
        preStoreCardItem.purchaseTime = preStoreCard.createdTime;
        if (leaguerPrdCardItem.itemType == ProductCardItemEnum.PRODUCT) {//项目
          preStoreCardItem.name = allProductMap.get(leaguerPrdCardItem.pgId).name;
          preStoreCardItem.number = allProductMap.get(leaguerPrdCardItem.pgId).number;
        } else if (leaguerPrdCardItem.itemType == ProductCardItemEnum.GOODS) {//商品
          preStoreCardItem.name = allGoodsMap.get(leaguerPrdCardItem.pgId).name;
          preStoreCardItem.number = allGoodsMap.get(leaguerPrdCardItem.pgId).number;
        } else if (leaguerPrdCardItem.itemType == ProductCardItemEnum.PACKAGE) {//套餐
          preStoreCardItem.name = allPackageProjectMap.get(leaguerPrdCardItem.pgId).name;
          preStoreCardItem.number = allPackageProjectMap.get(leaguerPrdCardItem.pgId).number;
        }
        preStoreCardItemList.push(preStoreCardItem);
      }
    }
    return preStoreCardItemList;
  }

  /**
   * 获取会员次卡列表
   * @param leaguerProductCardMap
   * @param prdInfoMap
   * @returns {PrdCardData[]}
   */
  private getPrdCardDataList(leaguerProductCardMap,prdInfoMap:ZmMap<ProductInfo>,goodsMap:ZmMap<Goods>,packageMap:ZmMap<PackageProject>,prdCardTypeMap:ZmMap<PrdCardType>,productCardMap:ZmMap<ProductCard>):Array<PrdCardData> {
    let prdCardDataList = new Array<PrdCardData>();
    for (let index in leaguerProductCardMap) {
      let leaguerProductCard: LeaguerProductCard = leaguerProductCardMap[index];
      let productCard:ProductCard = productCardMap.get(leaguerProductCard.cardId);
      if (!AppUtils.isNullObj(productCard)) {
        let prdCardData = PrdCardData.fromProductCard(productCard);
        prdCardData.cardType = productCard.typeId&&prdCardTypeMap.get(productCard.typeId)?prdCardTypeMap.get(productCard.typeId).name:'-';
        prdCardData.cardImgUrl = productCard.imgPath?AppCfg.getInstance().getImgPreUrl() + productCard.imgPath:prdCardData.cardImgUrl;
        prdCardData.purchaseTime = leaguerProductCard.purchaseTime;
        prdCardData.endTime = leaguerProductCard.endTime;
        prdCardData.state = leaguerProductCard.state;
        if(!AppUtils.isNullObj(leaguerProductCard.leaguerPrdCardItems)){
          leaguerProductCard.leaguerPrdCardItems.forEach((leaguerPrdCardItem: LeaguerPrdCardItem) => {
            if(leaguerPrdCardItem.pgId == "-1") {//不限项目
              //旧数据
            }else if(leaguerPrdCardItem.pgId != "-1"){//限项目
              let cardProductData = new CardProductData();
              if(leaguerPrdCardItem.itemType == ProductCardItemEnum.PRODUCT){//项目
                let productInfoTmp = prdInfoMap.get(leaguerPrdCardItem.pgId);
                cardProductData.name = productInfoTmp?productInfoTmp.name:'-';
                cardProductData.count = leaguerPrdCardItem.count;
                cardProductData.restCount = leaguerPrdCardItem.restCount;
              }else if(leaguerPrdCardItem.itemType == ProductCardItemEnum.GOODS){//商品
                let goods = goodsMap.get(leaguerPrdCardItem.pgId);
                cardProductData.name = goods?goods.name:'-';
                cardProductData.count = leaguerPrdCardItem.count;
                cardProductData.restCount = leaguerPrdCardItem.restCount;
              }else if(leaguerPrdCardItem.itemType == ProductCardItemEnum.PACKAGE){//套餐
                let packageProject = packageMap.get(leaguerPrdCardItem.pgId);
                cardProductData.name = packageProject?packageProject.name:'-';
                cardProductData.count = leaguerPrdCardItem.count;
                cardProductData.restCount = leaguerPrdCardItem.restCount;
              }
              prdCardData.cardProductList.push(cardProductData);
            }
          })
        }
        prdCardDataList.push(prdCardData);
      }
    }
    return prdCardDataList;
  }
  // private async getPrdCardDataList(leaguerProductCardMap,prdInfoMap:ZmMap<ProductInfo>,goodsMap:ZmMap<Goods>,packageMap:ZmMap<PackageProject>,prdCardTypeMap:ZmMap<PrdCardType>):Promise<Array<PrdCardData>> {
  //   let prdCardDataList = new Array<PrdCardData>();
  //   for (let index in leaguerProductCardMap) {
  //     let leaguerProductCard: LeaguerProductCard = leaguerProductCardMap[index];
  //     let productCard: ProductCardDetail = await this.productCardDetailCacheDataHolder.getData(leaguerProductCard.cardId);
  //     if (!AppUtils.isNullObj(productCard)) {
  //       let prdCardData = PrdCardData.fromProductCard(productCard);
  //       if(productCard.typeId){
  //         prdCardData.cardType = prdCardTypeMap.get(productCard.typeId)?prdCardTypeMap.get(productCard.typeId).name:'-';
  //       }
  //
  //       if (productCard.imgPath) {
  //         prdCardData.cardImgUrl = AppCfg.getInstance().getImgPreUrl() + productCard.imgPath;
  //       }
  //       prdCardData.purchaseTime = leaguerProductCard.purchaseTime;
  //       prdCardData.endTime = leaguerProductCard.endTime;
  //       prdCardData.state = leaguerProductCard.state;
  //       if(!AppUtils.isNullObj(productCard.productCardItems)){
  //         productCard.productCardItems.forEach((productCardItem:ProductCardItem)=>{
  //           //helen
  //           // if((productCardItem.pgId == "-1") && (productCardItem.count == -1)){//不限项目不限次数
  //           // }else if((productCardItem.pgId == "-1") && (productCardItem.count != -1)){//不限项目限次数
  //           //   prdCardData.count = productCardItem.count;
  //           // }else if((productCardItem.pgId != "-1") && (productCardItem.count != -1)){//限项目限次数
  //           if(productCardItem.pgId != "-1"){
  //             if(productCardItem.itemType == ProductCardItemEnum.PRODUCT){//项目
  //               let productInfoTmp = prdInfoMap.get(productCardItem.pgId);
  //               if (productInfoTmp) {
  //                 let cardProductData = new CardProductData();
  //                 cardProductData.name = productInfoTmp.name;
  //                 if(leaguerProductCard.leaguerPrdCardItems){
  //                   for(let i=0;i<leaguerProductCard.leaguerPrdCardItems.length;i++){
  //                     let leaguerPrdCardItem = leaguerProductCard.leaguerPrdCardItems[i];
  //                     if(leaguerPrdCardItem.pgId == productCardItem.pgId){
  //                       cardProductData.count = leaguerPrdCardItem.count;
  //                       cardProductData.restCount = leaguerPrdCardItem.restCount;
  //                       break;
  //                     }
  //                   }
  //                 }
  //                 prdCardData.cardProductList.push(cardProductData);
  //               }
  //             }else if(productCardItem.itemType == ProductCardItemEnum.GOODS){//商品
  //               let goods = goodsMap.get(productCardItem.pgId);
  //               if (goods) {
  //                 let cardProductData = new CardProductData();
  //                 cardProductData.name = goods.name;
  //                 if(leaguerProductCard.leaguerPrdCardItems){
  //                   for(let i=0;i<leaguerProductCard.leaguerPrdCardItems.length;i++){
  //                     let leaguerPrdCardItem = leaguerProductCard.leaguerPrdCardItems[i];
  //                     if(leaguerPrdCardItem.pgId == productCardItem.pgId){
  //                       cardProductData.count = leaguerPrdCardItem.count;
  //                       cardProductData.restCount = leaguerPrdCardItem.restCount;
  //                       break;
  //                     }
  //                   }
  //                 }
  //                 prdCardData.cardProductList.push(cardProductData);
  //               }
  //             }else if(productCardItem.itemType == ProductCardItemEnum.PACKAGE){//套餐
  //               let packageProject = packageMap.get(productCardItem.pgId);
  //               if (packageProject) {
  //                 let cardProductData = new CardProductData();
  //                 cardProductData.name = packageProject.name;
  //                 if(leaguerProductCard.leaguerPrdCardItems){
  //                   for(let i=0;i<leaguerProductCard.leaguerPrdCardItems.length;i++){
  //                     let leaguerPrdCardItem = leaguerProductCard.leaguerPrdCardItems[i];
  //                     if(leaguerPrdCardItem.pgId == productCardItem.pgId){
  //                       cardProductData.count = leaguerPrdCardItem.count;
  //                       cardProductData.restCount = leaguerPrdCardItem.restCount;
  //                       break;
  //                     }
  //                   }
  //                 }
  //                 prdCardData.cardProductList.push(cardProductData);
  //               }
  //             }
  //           }
  //         })
  //       }
  //       prdCardDataList.push(prdCardData);
  //     }
  //   }
  //   return new Promise<Array<PrdCardData>>(resolve=>{
  //     resolve(prdCardDataList);
  //   });
  // }

  /**
   * 获取服务人员名称
   * @param buserList
   * @param buserIds
   * @returns {string}
   */
  private getLeaguerStaffName(buserList: Array<BUser>, buserIds: Array<string>):string {
    let buserMap = new ZmMap<BUser>();
    for (let i = 0; i < buserList.length; i++) {
      let buser = buserList[i];
      buserMap.put(buser.id, buser);
    }
    let buserNameArr = new Array<string>();
    for (let i = 0; i < buserIds.length; i++) {
      buserNameArr.push(buserMap.get(buserIds[i]).name);
    }
    return buserNameArr.join("、");
  }

  /**
   * 获取会员等级
   * @param leaguer
   * @returns {CustomerTypeEnum}
   */
  private getLeaguerConsumeType(leaguer: LeaguerDetail,storeConfig:StoreConfig):number {
    let leaguerConfig = new LeaguerConfig();
    AppUtils.copy(leaguerConfig,storeConfig.leaguerConfig);
    let leaguerTypeMap = leaguerConfig.getLeaguerTypeMap();
    let highType = leaguerTypeMap.get((SysInitLeaguerTypeEnum.HIGH_GRADE_CUSTOMER + 1).toString());
    let riskType = leaguerTypeMap.get((SysInitLeaguerTypeEnum.RISK_CUSTOMER + 1).toString());
    let quiescenceType = leaguerTypeMap.get((SysInitLeaguerTypeEnum.QUIESCENCE_CUSTOMER + 1).toString());

    let leaguerType = CustomerTypeEnum.UNKONW;
    let consumeTime = leaguer.lastConsumeTime;
    let nowTime = new Date().getTime();
    let distance = nowTime - consumeTime;
    if (distance <= Constants.ONEDAY_TIMESTAMP * highType.consumeDates) {
      leaguerType = CustomerTypeEnum.HIGH_GRADE_CUSTOMER;
    }
    if (distance > Constants.ONEDAY_TIMESTAMP * riskType.consumeDates) {
      leaguerType = CustomerTypeEnum.RISK_CUSTOMER;
    }
    if (distance > Constants.ONEDAY_TIMESTAMP * quiescenceType.consumeDates) {
      leaguerType = CustomerTypeEnum.QUIESCENCE_CUSTOMER;
    }
    return leaguerType;
  }

  /**
   * 删除跟进记录
   * @param leaguerRecordId
   * @returns {Promise<boolean>}
   */
  public deleteLeaguerRecord(leaguerRecordId:string):Promise<boolean>{
    return this.leaguerRecordMgr.deleteLeaguerRecord(leaguerRecordId);
  }

}

export class LeaguerDetailViewData{
  public leaguer:LeaguerDetail = new LeaguerDetail();//当前会员
  public headImg:string;//用户头像
  public membershipCard:MembershipCard = new MembershipCard();//会员卡
  public buserNames:string = "";//服务人员名称

  public leaguerRecordQueryForm = new LeaguerRecordQueryForm();
  public leaguerRecordList:Array<LeaguerRecord> = new Array<LeaguerRecord>();
  public relatePrdMap = new ZmMap<Array<string>>();

  public prdCardMap:ZmMap<ProductCard> = new ZmMap<ProductCard>();//次卡map
  public prdCardTypeMap: ZmMap<PrdCardType> = new ZmMap<PrdCardType>();//次卡分类map
  public prdInfoMap:ZmMap<ProductInfo> = new ZmMap<ProductInfo>();//项目map

  public orderQueryForm:OrderQueryForm = new OrderQueryForm();
  public orderList:Array<Order> = new Array();//会员相关订单列表

  public prdCardDataList:Array<PrdCardData> = new Array();
  public prdCardDataListTmp:Array<PrdCardData> = new Array();//页面显示的次卡组装信息列表

  public productDataList:Array<PreStoreCardItem> = new Array<PreStoreCardItem>();
  public productDataListTmp:Array<PreStoreCardItem> = new Array<PreStoreCardItem>();//页面显示预存列表

  public labelList:Array<LeaguerLabel> = new Array<LeaguerLabel>();//会员标签
  public expandAttrList:Array<ExpandAttrLabelValue> = new Array<ExpandAttrLabelValue>();//会员扩展属性
  public leaguerOriginConfigMap:ZmMap<LeaguerOriginConfig> = new ZmMap<LeaguerOriginConfig>();//会员来源

  public loadingFinish :boolean = false;

  public minTime: any;
  public maxTime: any;

  public page:number;//当前页码
  public recordCount:number;//总记录数

  public cardPage:number;//当前页码
  public cardRecordCount:number;//总记录数

  public productPage:number;//当前页码
  public productRecordCount:number;//总记录数

  public leaguerRecordPage:number;//当前页码
  public leaguerRecordCount:number;//总记录数

  constructor(){
    let date = new Date();
    let lastWeekTime = date.getTime() - 1000*60*60*24*7;
    let lastWeekDate = new Date(lastWeekTime);
    this.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.minTime = {year: lastWeekDate.getFullYear(), month: lastWeekDate.getMonth() + 1, day: lastWeekDate.getDate()};
  }
}

export class PrdCardData{
  public cardId:string;//卡id
  public cardImgUrl:string = "";//卡图片
  public cardName:string;//卡名称
  public cardType:string;//卡分类
  public cardProductList:Array<CardProductData> = new Array();//次卡项目 限项目
  public count:number;//任意项目次数 不限项目
  public validPeriod:number;//有效期
  public validPeriodUnit:number;//有效期
  public purchaseTime:string;//购买时间
  public endTime:string;//到期时间
  public state:number;//状态

  public static fromProductCard(productCard:ProductCard):PrdCardData{
    let prdCardData = new PrdCardData();
    prdCardData.cardId = productCard.id;
    prdCardData.cardName = productCard.name;
    prdCardData.validPeriod = productCard.validPeriod;
    prdCardData.validPeriodUnit = productCard.validPeriodUnit;
    return prdCardData;
  }

}

export class ProductData{
  public imgUrl:string = "assets/images/pore.png";
  public id:string;
  public number:string;//编号
  public name:string;//项目名
  public productCardName:string;//所属次卡
  public totalCount:number;//总次数
  public availableCount:number;//剩余次数
  public validPeriod:number;//有效期
  public validPeriodUnit:number;//有效期
  public purchaseTime:string;//购买时间
  public endTime:string;//到期时间
}

export class PreStoreCardItem{
  public id:string;
  public imgUrl:string = "assets/images/pore.png";
  public number:string;//编号
  public name:string;//项目名
  public type:number;//产品分类
  public count:number;//总次数
  public restCount:number;//剩余次数
  public purchaseTime:number;//购买时间
}

export class CardProductData{
  public name:string;
  public count:number;
  public restCount:number;//剩余次数
}

export class ExpandAttrLabelValue{
  label:string;
  value:string;
}


