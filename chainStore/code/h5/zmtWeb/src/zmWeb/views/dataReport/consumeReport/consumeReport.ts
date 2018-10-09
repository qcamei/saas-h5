import {ChangeDetectorRef, Component, OnDestroy, OnInit, ChangeDetectionStrategy} from "@angular/core";
import {DataReportViewDataMgr} from "../dataReportViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {DataReportMgr} from "../../../bsModule/dataReport/DataReportMgr";
import {DataReportQueryForm} from "../../../bsModule/dataReport/apiData/DataReportQueryForm";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {DataReport} from "../../../bsModule/dataReport/apiData/DataReport";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {BuyTypeEnum} from "../../../bsModule/workFlow/data/BuyTypeEnum";
import {GoodsType} from "../../../bsModule/storeGoods/data/GoodsType";
import {AppCfg} from "../../../comModule/AppCfg";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StorePackageProject} from "../../../bsModule/storePackageProject/data/StorePackageProject";
import {StorePackageProjectSynDataHolder} from "../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {PackageProjectType} from "../../../bsModule/storePackageProject/data/PackageProjectType";

/**
 * 数据报表 销售统计
 *
 */
@Component({
  selector:'consume-report',
  templateUrl: 'consumeReport.html',
  styleUrls: ['consumeReport.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class ConsumeReportPage implements OnInit,OnDestroy{
  private viewDataSub: any;
  private service: ConsumeReportService;
  public viewData: ConsumeReportViewData;
  public TodayActive:Boolean ;
  public YesterdayActive:Boolean;
  public MonthActive :Boolean = true;
  public lmonthActive :Boolean;
  public operatorUp :Boolean;
  public operatorDown :Boolean = true;


  constructor(
    private dataReportMgr:DataReportMgr,
    private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
    private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
    private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
    private storePackageProjectSynDataHolder:StorePackageProjectSynDataHolder,
    private dataReportViewDataMgr:DataReportViewDataMgr,
    private cdRef: ChangeDetectorRef){
    this.service = new ConsumeReportService(this.dataReportMgr,
      this.storeProductInfoSynDataHolder,
      this.storeGoodsSynDataHolder,
      this.storeCardInfoSynDataHolder,
      this.storePackageProjectSynDataHolder,
      this.dataReportViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.dataReportViewDataMgr.subscribeConsumeReportVD((viewDataP:ConsumeReportViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){

      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 页面点击事件 根据时间过滤销售列表
   */
  findConsumeByTime(){
    this.service.findConsumeByTime(this.viewData);
  }

  /**
   * 页面点击事件 选择时间今天、昨天、本月、上月
   * @param index
   */
  chooseTime(index){
    switch (index){
      case 0:
        this.setTodayTime();
        break;
      case 1:
        this.setYesterdayTime();
        break;
      case 2:
        this.setThisMonthTime();
        break;
      case 3:
        this.setLastMonthTime();
        break;
    }
  }

  /**
   * 页面点击事件 今天
   */
  setTodayTime(){
    this.TodayActive = true;
    this.YesterdayActive = false;
    this.MonthActive  = false;
    this.lmonthActive  = false;
    let date = new Date();
    this.viewData.minDate = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.viewData.maxDate = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.service.findConsumeByTime(this.viewData);
  }

  /**
   * 页面点击事件 昨日
   */
  setYesterdayTime(){
    this.TodayActive = false;
    this.YesterdayActive = true;
    this.MonthActive  = false;
    this.lmonthActive  = false;
    let nowDate = new Date();
    let yesterdayTime = nowDate.getTime() - 1000*60*60*24;
    let date = new Date(yesterdayTime);
    this.viewData.minDate = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.viewData.maxDate = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.service.findConsumeByTime(this.viewData);
  }

  /**
   * 页面点击事件 本月
   */
  setThisMonthTime(){
    this.TodayActive = false;
    this.YesterdayActive = false;
    this.MonthActive  = true;
    this.lmonthActive  = false;
    let date = new Date();
    this.viewData.minDate = {year: date.getFullYear(), month: date.getMonth() + 1, day: 1};
    this.viewData.maxDate = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.service.findConsumeByTime(this.viewData);
  }

  /**
   * 页面点击事件 上月
   */
  setLastMonthTime(){
    this.TodayActive = false;
    this.YesterdayActive = false;
    this.MonthActive  = false;
    this.lmonthActive  = true;
    let date = new Date();
    let day = date.getDate();
    let lastMonthTime = date.getTime() - 1000*60*60*24*day;
    let lastMonthDate = new Date(lastMonthTime);

    this.viewData.maxDate = {year: lastMonthDate.getFullYear(), month: lastMonthDate.getMonth() + 1, day: lastMonthDate.getDate()};
    this.viewData.minDate = {year: lastMonthDate.getFullYear(), month: lastMonthDate.getMonth() + 1, day: 1};

    this.service.findConsumeByTime(this.viewData);
  }

  /**
   * 页面点击事件 按消费数量排序
   */
  groupByConsumeCount(){
    this.viewData.consumeCountAsc = !this.viewData.consumeCountAsc;
    this.viewData.allConsumeList.sort((a,b) =>{
      if(this.viewData.consumeCountAsc){
        return parseInt((a.consumeCount - b.consumeCount).toString());
      }else{
        return parseInt((b.consumeCount - a.consumeCount).toString());
      }
    })
    this.getPageData(1);
  }

  /**
   * 页面点击事件 按消费金额排序
   */
  groupByConsumeAmount(){
    this.viewData.consumeAmountAsc = !this.viewData.consumeAmountAsc;
    this.viewData.allConsumeList.sort((a,b) =>{
      if(this.viewData.consumeAmountAsc){
        return parseInt((a.consumeAmount - b.consumeAmount).toString());
      }else{
        return parseInt((b.consumeAmount - a.consumeAmount).toString());
      }
    })
    this.getPageData(1);
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    let data = this.viewData.allConsumeList;
    let  pageData = AppUtils.getPageData(curPage,data);
    this.viewData.consumeList = pageData;
  }

}


export class ConsumeReportService{
  constructor(private dataReportMgr:DataReportMgr,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private storePackageProjectSynDataHolder:StorePackageProjectSynDataHolder,
              private dataReportViewDataMgr:DataReportViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new ConsumeReportViewData();
    this.dataReportViewDataMgr.setConsumeReportViewData(viewDataTmp);

    this.buildViewData((viewDataP:ConsumeReportViewData) =>{
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.dataReportViewDataMgr.setConsumeReportViewData(viewDataP)
  }

  /**
   * 查询storeBonusRecord
   * @param callback
   */
  public async buildViewData(callback:(viewDataP:ConsumeReportViewData) => void){
    let viewDataTmp = new ConsumeReportViewData();

    //初始化时间区间
    let date = new Date();
    viewDataTmp.minDate = {year: date.getFullYear(), month: date.getMonth() + 1, day: 1};
    viewDataTmp.maxDate = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};

    let minTime = this.getMinTime(viewDataTmp.minDate);
    let maxTime = this.getMaxTime(viewDataTmp.maxDate);

    //请求dataReport
    let storeId = SessionUtil.getInstance().getStoreId();
    let dataReportQueryForm = new DataReportQueryForm();
    dataReportQueryForm.storeId = storeId;
    dataReportQueryForm.minTime = minTime;
    dataReportQueryForm.maxTime = maxTime;
    let dataReportList:Array<DataReport> = await this.dataReportMgr.findDataReprotList(dataReportQueryForm);

    //请求店铺项目
    let storeProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    if(!AppUtils.isNullObj(storeProductInfo)){
      viewDataTmp.productMap = storeProductInfo.getAllProductInfoMap();
      viewDataTmp.productTypeMap = storeProductInfo.getAllProductTypeMap();
    }

    //请求店铺商品
    let storeGoods = await this.storeGoodsSynDataHolder.getData(storeId);
    if(!AppUtils.isNullObj(storeGoods)){
      viewDataTmp.goodsMap = storeGoods.getAllGoodsMap();
      viewDataTmp.goodsTypeMap = storeGoods.getGoodsTypeMap();
    }

    //请求店铺卡包
    let storeCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    if(!AppUtils.isNullObj(storeCardInfo)){
      viewDataTmp.productCardMap = storeCardInfo.getProductCardMap();
    }

    let storePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
    if(!AppUtils.isNullObj(storePackageProject)){
      viewDataTmp.packageMap = storePackageProject.getAllPackageProjectMap();
      viewDataTmp.packageTypeMap = storePackageProject.getAllPackageTypeMap();
    }

    //组装显示数据
    if(!AppUtils.isNullObj(dataReportList)){
      viewDataTmp = this.buildData(viewDataTmp,dataReportList);
    }

    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  /**
   * 组装显示数据
   * @param dataReportList
   * @param viewDataTmp
   */
  private buildData(consumeReportViewData: ConsumeReportViewData,dataReportList: Array<DataReport>):ConsumeReportViewData {
    let viewDataTmp = new ConsumeReportViewData();
    AppUtils.copy(viewDataTmp,consumeReportViewData);
    viewDataTmp.consumeAmount = 0;
    viewDataTmp.productAmount = 0;
    viewDataTmp.goodsAmount = 0;
    viewDataTmp.productCardAmount = 0;
    viewDataTmp.packageAmount = 0;
    viewDataTmp.rechargeAmount = 0;
    viewDataTmp.consumeList = [];//清空数据
    viewDataTmp.consumeMap.clear();//清空数据
    AppCfg.getInstance().getImgPreUrl();
    let imgPreUrl = AppCfg.getInstance().getImgPreUrl();
    dataReportList.forEach((item) => {
      item.pay = AppUtils.roundPoint(item.pay,2);
      if (item.buyType == BuyTypeEnum.PRODUCT) {
        let productInfo = viewDataTmp.productMap.get(item.pgId);
        if (productInfo) {//已添加 累加数量金额
          let key = AppUtils.format("{0}_{1}", item.buyType, item.pgId);
          if (viewDataTmp.consumeMap.contains(key)) {
            let consumeDataTmp = viewDataTmp.consumeMap.get(key);
            consumeDataTmp.consumeCount = consumeDataTmp.consumeCount + parseInt(item.count.toString());
            consumeDataTmp.consumeAmount = consumeDataTmp.consumeAmount + parseFloat(item.pay.toString());
          } else {//没有则新建
            let consumeData = new ConsumeData();
            consumeData.buyType = BuyTypeEnum.PRODUCT;
            consumeData.id = item.pgId;
            consumeData.imgUrl = productInfo.defaultImg ? imgPreUrl + productInfo.defaultImg : "";
            consumeData.name = productInfo.name ? productInfo.name : "-";
            consumeData.type = viewDataTmp.productTypeMap.get(productInfo.typeId.toString()) ? viewDataTmp.productTypeMap.get(productInfo.typeId.toString()).name : '-';
            consumeData.consumeCount = parseInt(item.count.toString());
            consumeData.consumeAmount = parseFloat(item.pay.toString());
            viewDataTmp.consumeMap.put(key, consumeData);
          }
          viewDataTmp.productAmount = viewDataTmp.productAmount + parseFloat(item.pay.toString());//项目总金额
        }
      } else if (item.buyType == BuyTypeEnum.GOODS) {
        let goods = viewDataTmp.goodsMap.get(item.pgId);
        if (goods) {
          let key = AppUtils.format("{0}_{1}", item.buyType, item.pgId);
          if (viewDataTmp.consumeMap.contains(key)) {
            let consumeDataTmp = viewDataTmp.consumeMap.get(key);
            consumeDataTmp.consumeCount = consumeDataTmp.consumeCount + parseInt(item.count.toString());
            consumeDataTmp.consumeAmount = consumeDataTmp.consumeAmount + parseFloat(item.pay.toString());
          } else {//没有则新建
            let consumeData = new ConsumeData();
            consumeData.buyType = BuyTypeEnum.GOODS;
            consumeData.id = item.pgId;
            consumeData.imgUrl = goods.defaultImg ? imgPreUrl + goods.defaultImg : "";
            consumeData.name = goods.name ? goods.name : "-";
            consumeData.type = viewDataTmp.goodsTypeMap.get(goods.typeId.toString()) ? viewDataTmp.goodsTypeMap.get(goods.typeId.toString()).name : '-';
            consumeData.consumeCount = parseInt(item.count.toString());
            consumeData.consumeAmount = parseFloat(item.pay.toString());
            viewDataTmp.consumeMap.put(key, consumeData);
          }
          viewDataTmp.goodsAmount = viewDataTmp.goodsAmount + parseFloat(item.pay.toString());//商品总金额
        }
      } else if (item.buyType == BuyTypeEnum.PRDCARD) {
        let productCard = viewDataTmp.productCardMap.get(item.pgId);
        if (productCard) {
          let key = AppUtils.format("{0}_{1}", item.buyType, item.pgId);
          if (viewDataTmp.consumeMap.contains(key)) {
            let consumeDataTmp = viewDataTmp.consumeMap.get(key);
            consumeDataTmp.consumeCount = consumeDataTmp.consumeCount + parseInt(item.count.toString());
            consumeDataTmp.consumeAmount = consumeDataTmp.consumeAmount + parseFloat(item.pay.toString());
          } else {//没有则新建
            let consumeData = new ConsumeData();
            consumeData.buyType = BuyTypeEnum.PRDCARD;
            consumeData.id = item.pgId;
            consumeData.imgUrl = productCard.imgPath ? imgPreUrl + productCard.imgPath : "";
            consumeData.name = productCard.name ? productCard.name : "-";
            consumeData.type = '-';
            consumeData.consumeCount = parseInt(item.count.toString());
            consumeData.consumeAmount = parseFloat(item.pay.toString());
            viewDataTmp.consumeMap.put(key, consumeData);
          }
          viewDataTmp.productCardAmount = viewDataTmp.productCardAmount + parseFloat(item.pay.toString());
        }
      }else if(item.buyType == BuyTypeEnum.RECHARGE){//会员充值
        viewDataTmp.rechargeAmount = viewDataTmp.rechargeAmount + parseFloat(item.pay.toString());//充值总金额
      }else if(item.buyType == BuyTypeEnum.PACKAGE){
        let packageProject = viewDataTmp.packageMap.get(item.pgId);
        if (packageProject) {
          let key = AppUtils.format("{0}_{1}", item.buyType, item.pgId);
          if (viewDataTmp.consumeMap.contains(key)) {
            let consumeDataTmp = viewDataTmp.consumeMap.get(key);
            consumeDataTmp.consumeCount = consumeDataTmp.consumeCount + parseInt(item.count.toString());
            consumeDataTmp.consumeAmount = consumeDataTmp.consumeAmount + parseFloat(item.pay.toString());
          } else {//没有则新建
            let consumeData = new ConsumeData();
            consumeData.buyType = BuyTypeEnum.GOODS;
            consumeData.id = item.pgId;
            consumeData.imgUrl = packageProject.defaultImg ? imgPreUrl + packageProject.defaultImg : "";
            consumeData.name = packageProject.name ? packageProject.name : "-";
            consumeData.type = viewDataTmp.packageTypeMap.get(packageProject.typeId.toString()) ? viewDataTmp.packageTypeMap.get(packageProject.typeId.toString()).name : '-';
            consumeData.consumeCount = parseInt(item.count.toString());
            consumeData.consumeAmount = parseFloat(item.pay.toString());
            viewDataTmp.consumeMap.put(key, consumeData);
          }
          viewDataTmp.packageAmount = viewDataTmp.packageAmount + parseFloat(item.pay.toString());//套餐总金额
        }
      }
    })
    viewDataTmp.page = 1;
    viewDataTmp.recordCount = viewDataTmp.consumeMap.values().length;
    viewDataTmp.allConsumeList = viewDataTmp.consumeMap.values();
    //按销售金额排序
    viewDataTmp.allConsumeList.sort((a,b) =>{
      if(viewDataTmp.consumeAmountAsc){
        return parseInt((a.consumeAmount - b.consumeAmount).toString());
      }else{
        return parseInt((b.consumeAmount - a.consumeAmount).toString());
      }
    })
    viewDataTmp.consumeList = AppUtils.getPageData(1,viewDataTmp.allConsumeList);
    viewDataTmp.consumeAmount = viewDataTmp.productAmount + viewDataTmp.goodsAmount + viewDataTmp.productCardAmount + viewDataTmp.packageAmount + viewDataTmp.rechargeAmount;//销售总金额

    return viewDataTmp;
  }

  /**
   * 根据时间过滤销售报表
   * @param viewData
   * @returns {Promise<void>}
   */
  public async findConsumeByTime(viewData){
    let minTime = this.getMinTime(viewData.minDate);
    let maxTime = this.getMaxTime(viewData.maxDate);

    //请求dataReport
    let storeId = SessionUtil.getInstance().getStoreId();
    let dataReportQueryForm = new DataReportQueryForm();
    dataReportQueryForm.storeId = storeId;
    dataReportQueryForm.minTime = minTime;
    dataReportQueryForm.maxTime = maxTime;
    let dataReportList:Array<DataReport> = await this.dataReportMgr.findDataReprotList(dataReportQueryForm);

    viewData = this.buildData(viewData,dataReportList);
    viewData.loadingFinish = true;
    this.dataReportViewDataMgr.setConsumeReportViewData(viewData);
  }

  /**
   * 转化日期 最小时间 00:00:00
   * @returns {number}
   */
  private getMinTime(dateP):string {
    let arrTmp = [dateP.year, dateP.month, dateP.day];
    let date = new Date(arrTmp.join("/") + " 00:00:00");
    return date.getTime().toString();
  }

  /**
   * 转化日期 最大时间 23:59:59
   * @returns {number}
   */
  private getMaxTime(dateP):string {
    let arrTmp = [dateP.year, dateP.month, dateP.day];
    let date = new Date(arrTmp.join("/") +" 23:59:59");
    return date.getTime().toString();
  }

}

export class ConsumeReportViewData{
  public productMap: ZmMap<ProductInfo> = new ZmMap<ProductInfo>();//项目
  public productTypeMap: ZmMap<ProductType> = new ZmMap<ProductType>();//项目类型
  public goodsMap: ZmMap<Goods> = new ZmMap<Goods>();//商品
  public goodsTypeMap: ZmMap<GoodsType> = new ZmMap<GoodsType>();//商品类型
  public productCardMap: ZmMap<ProductCard> = new ZmMap<ProductCard>();//次卡
  public packageMap: ZmMap<PackageProject> = new ZmMap<PackageProject>();//套餐
  public packageTypeMap: ZmMap<PackageProjectType> = new ZmMap<PackageProjectType>();//套餐类型

  public consumeMap:ZmMap<ConsumeData> = new ZmMap<ConsumeData>();
  //页面销售列表数据
  public consumeList:Array<ConsumeData> = new Array();
  public allConsumeList:Array<ConsumeData> = new Array();

  public consumeAmount:number = 0;//销售总金额
  public productAmount:number = 0;//项目总金额
  public goodsAmount:number = 0;//商品总金额
  public productCardAmount:number = 0;//次卡总金额
  public packageAmount:number = 0;//套餐总金额
  public rechargeAmount:number = 0;//充值总金额

  public consumeCountAsc:boolean = false;//是否升序
  public consumeAmountAsc:boolean = false;//是否升序

  //查询参数
  public minDate:any;
  public maxDate:any;

  public page:number;//当前页码
  public recordCount:number;//总记录数

  public loadingFinish:boolean = false;

}

//销售列表项实体bean
export class ConsumeData{
  public buyType:number;//购买类型
  public id:string;
  public imgUrl:string = "";
  public name:string;
  public type:string;//分类
  public consumeCount:number = 0;//销量
  public consumeAmount:number = 0;//销售金额
}
