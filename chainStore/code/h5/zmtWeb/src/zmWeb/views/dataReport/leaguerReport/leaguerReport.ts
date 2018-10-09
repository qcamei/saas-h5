import {ChangeDetectorRef, Component, OnDestroy, OnInit, ChangeDetectionStrategy} from "@angular/core";
import {DataReportViewDataMgr} from "../dataReportViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {DataReportMgr} from "../../../bsModule/dataReport/DataReportMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {MemberDataCount} from "../../../bsModule/dataReport/apiData/MemberDataCount";
import {DataReportQueryForm} from "../../../bsModule/dataReport/apiData/DataReportQueryForm";
import {Order} from "../../../bsModule/order/data/Order";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {OrderTypeEnum} from "../../../bsModule/order/data/OrderTypeEnum";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {AppCfg} from "../../../comModule/AppCfg";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {LeaguerDetailQueryForm} from "../../../bsModule/leaguerDetail/apiData/LeaguerDetailQueryForm";
import {PageResp} from "../../../comModule/PageResp";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {AppRouter} from "../../../comModule/AppRouter";

/**
 * 数据报表 会员统计
 */
@Component({
  selector:'leaguer-report',
  templateUrl: 'leaguerReport.html',
  styleUrls: ['leaguerReport.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class LeaguerReportPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: LeaguerReportService;
  public viewData: LeaguerReportViewData;
  public TodayActive:Boolean ;
  public YesterdayActive:Boolean;
  public MonthActive :Boolean = true;
  public lmonthActive :Boolean;

  constructor(
    private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
    private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
    private leaguerDetailMgr:LeaguerDetailMgr,
    private dataReportMgr:DataReportMgr,
    private statementViewDataMgr:DataReportViewDataMgr,
    private cdRef: ChangeDetectorRef){
    this.service = new LeaguerReportService(this.dataReportMgr,this.storeLeaguerInfoSynDataHolder,this.leaguerDetailMgr,this.storeCardInfoSynDataHolder,this.statementViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.statementViewDataMgr.subscribeLeaguerReportVD((viewDataP:LeaguerReportViewData) => {
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
   * 点击事件 跳转会员详情
   * @param leaguerId
   */
  goLeaguerDetail(leaguerId){
      AppRouter.goLeaguerDetail(leaguerId);
  }

  /**
   * 页面点击事件 根据时间查询会员
   */
  findLeaguerByTime(){
    this.service.findLeaguerByTime(this.viewData);
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
    this.viewData.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.viewData.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.service.findLeaguerByTime(this.viewData);
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
    this.viewData.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.viewData.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.service.findLeaguerByTime(this.viewData);
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
    this.viewData.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: 1};
    this.viewData.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.service.findLeaguerByTime(this.viewData);
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

    this.viewData.maxTime = {year: lastMonthDate.getFullYear(), month: lastMonthDate.getMonth() + 1, day: lastMonthDate.getDate()};
    this.viewData.minTime = {year: lastMonthDate.getFullYear(), month: lastMonthDate.getMonth() + 1, day: 1};

    this.service.findLeaguerByTime(this.viewData);
  }

  /**
   * 页面点击事件 按客单价排序
   */
  groupByAvgPrice(){
    this.viewData.avgPriceAsc = !this.viewData.avgPriceAsc;
    this.viewData.leaguerConsumeDataList.sort((a,b) =>{
      if(this.viewData.avgPriceAsc){
        return parseInt((a.avgPrice - b.avgPrice).toString());
      }else{
        return parseInt((b.avgPrice - a.avgPrice).toString());
      }
    })
    this.getPageData(1);
  }

  /**
   * 页面点击事件 按消费次数排序
   */
  groupByConsumeCount(){
    this.viewData.consumeCountAsc = !this.viewData.consumeCountAsc;
    this.viewData.leaguerConsumeDataList.sort((a,b) =>{
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
    this.viewData.leaguerConsumeDataList.sort((a,b) =>{
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
    let data = this.viewData.leaguerConsumeDataList;
    let  pageData = AppUtils.getPageData(curPage,data);
    this.viewData.leaguerConsumeList = pageData;
  }

}

export class LeaguerReportService{
  constructor(private dataReportMgr:DataReportMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private leaguerDetailMgr:LeaguerDetailMgr,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private dataReportViewDataMgr:DataReportViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new LeaguerReportViewData();
    this.dataReportViewDataMgr.setLeaguerReportViewData(viewDataTmp);

    this.buildViewData((viewDataP:LeaguerReportViewData) =>{
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.dataReportViewDataMgr.setLeaguerReportViewData(viewDataP);
  }

  /**
   * 查询storeBonusRecord
   * @param callback
   */
  public async buildViewData(callback:(viewDataP:LeaguerReportViewData) => void){
    let viewDataTmp = new LeaguerReportViewData();

    //请求会员总数消费总次数
    let storeId = SessionUtil.getInstance().getStoreId();
    let memberDataCount:MemberDataCount = await this.dataReportMgr.getMemberDataCount(storeId);
    viewDataTmp.memberDataCount = memberDataCount;

    //初始化时间区间
    let date = new Date();
    viewDataTmp.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: 1};
    viewDataTmp.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};

    let dataReportQueryForm = new DataReportQueryForm();
    dataReportQueryForm.storeId = storeId;
    dataReportQueryForm.minTime = AppUtils.getMinTime(viewDataTmp.minTime);
    dataReportQueryForm.maxTime = AppUtils.getMaxTime(viewDataTmp.maxTime);
    let orderList:Array<Order> = await this.dataReportMgr.findOrderList(dataReportQueryForm);

    //请求会员
    let storeLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
    viewDataTmp.leaguerMap = storeLeaguerInfo.getValidLeaguerMap();

    //请求卡包
    let storeCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    viewDataTmp.memberCardMap = storeCardInfo.getMemberCardMap();

    //请求新增会员数
    let pageResp = await this.getLeaguerPlusCount(viewDataTmp);
    viewDataTmp.plusLeaguerCount = pageResp.totalCount;
    //组装页面数据
    viewDataTmp = this.buildData(viewDataTmp, orderList);

    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  private getLeaguerPlusCount(viewDataTmp: LeaguerReportViewData):Promise<PageResp> {
    let minTime = AppUtils.getMinTime(viewDataTmp.minTime);
    let maxTime = AppUtils.getMaxTime(viewDataTmp.maxTime);
    viewDataTmp.leaguerDetailQueryForm.storeId = SessionUtil.getInstance().getStoreId();
    viewDataTmp.leaguerDetailQueryForm.minTime = minTime;
    viewDataTmp.leaguerDetailQueryForm.maxTime = maxTime;
    return this.leaguerDetailMgr.getLeaguerDetailPageInfo(viewDataTmp.leaguerDetailQueryForm);
  }

  /**
   * 组装数据
   * @param viewDataTmp
   * @param orderList
   */
  private buildData(leaguerReportViewData: LeaguerReportViewData, orderList: Array<Order>):LeaguerReportViewData {
    let viewDataTmp = new LeaguerReportViewData();
    AppUtils.copy(viewDataTmp,leaguerReportViewData);
    viewDataTmp.leaguerConsumeDataList = [];//清空列表
    viewDataTmp.leaguerConsumeList = [];//清空列表
    // viewDataTmp.plusLeaguerCount = 0;//新增会员数
    viewDataTmp.consumeCount = 0;//消费会员数
    viewDataTmp.plusConsumeCount = 0;//新增消费数
    viewDataTmp.avgPrice = 0;//平均客单价
    viewDataTmp.leaguerMap.values().forEach((item:Leaguer) => {
      // if ((parseInt(item.createdTime) >= parseInt(minTime)) && (parseInt(item.createdTime) <= parseInt(maxTime))) {
      //   viewDataTmp.plusLeaguerCount = viewDataTmp.plusLeaguerCount + 1;//新增会员数
      // }
        let leaguerCosumeData = new LeaguerCosumeData();
        leaguerCosumeData.id = item.id;
        leaguerCosumeData.headImg = AppCfg.getInstance().getImgPreUrl() + item.headImg;
        leaguerCosumeData.name = item.name;
        leaguerCosumeData.phone = item.phone;
        // if (item.leaguerMemberCard && viewDataTmp.memberCardMap.get(item.leaguerMemberCard.cardId) && viewDataTmp.memberCardMap.get(item.leaguerMemberCard.cardId).name) {
        //   leaguerCosumeData.memberCard = viewDataTmp.memberCardMap.get(item.leaguerMemberCard.cardId).name;
        // }
        orderList.forEach((order) => {
          if (order.orderType == OrderTypeEnum.PURCHASE && order.leaguerId == item.id) {
            leaguerCosumeData.consumeCount = parseInt(leaguerCosumeData.consumeCount.toString()) + 1;
            leaguerCosumeData.consumeAmount = leaguerCosumeData.consumeAmount + AppUtils.roundPoint(order.cost,2);
            leaguerCosumeData.hasConsume = true;

            viewDataTmp.plusConsumeCount = parseInt(viewDataTmp.plusConsumeCount.toString()) + 1;//新增消费数
          }
        })
        if(leaguerCosumeData.consumeAmount > 0){
          leaguerCosumeData.avgPrice = AppUtils.roundPoint((leaguerCosumeData.consumeAmount / leaguerCosumeData.consumeCount),2);
        }

        viewDataTmp.leaguerConsumeDataList.push(leaguerCosumeData);
    })
    let totalConsumeAmount = 0;//总消费金额
    viewDataTmp.leaguerConsumeDataList.forEach((item) => {
      if (item.hasConsume) {
        viewDataTmp.consumeCount = parseInt(viewDataTmp.consumeCount.toString()) + 1;//消费会员数
      }
      totalConsumeAmount = AppUtils.roundPoint(totalConsumeAmount,2) + AppUtils.roundPoint(item.consumeAmount,2);
    })

    //分页
    viewDataTmp.page = 1;
    viewDataTmp.recordCount = viewDataTmp.leaguerConsumeDataList.length;
    //按金额排序
    viewDataTmp.leaguerConsumeDataList.sort((a,b) =>{
      if(viewDataTmp.consumeAmountAsc){
        return parseInt((a.consumeAmount - b.consumeAmount).toString());
      }else{
        return parseInt((b.consumeAmount - a.consumeAmount).toString());
      }
    })
    viewDataTmp.leaguerConsumeList = AppUtils.getPageData(1,viewDataTmp.leaguerConsumeDataList);

    if(totalConsumeAmount > 0){
      viewDataTmp.avgPrice = AppUtils.roundPoint((totalConsumeAmount / viewDataTmp.plusConsumeCount),2);//总的客单价
    }
    return viewDataTmp;
  }

  /**
   * 根据时间过滤会员报表
   * @param viewData
   * @returns {Promise<void>}
   */
  public async findLeaguerByTime(viewData){
    let storeId = SessionUtil.getInstance().getStoreId();
    let minArrTmp = [viewData.minTime.year,viewData.minTime.month,viewData.minTime.day];
    let minDate = new Date(minArrTmp.join("/") +" 00:00:00");

    let maxArrTmp = [viewData.maxTime.year,viewData.maxTime.month,viewData.maxTime.day];
    let maxDate = new Date(maxArrTmp.join("/") +" 23:59:59");

    let dataReportQueryForm = new DataReportQueryForm();
    dataReportQueryForm.storeId = storeId;
    dataReportQueryForm.minTime = minDate.getTime().toString();
    dataReportQueryForm.maxTime = maxDate.getTime().toString();
    let orderList:Array<Order> = await this.dataReportMgr.findOrderList(dataReportQueryForm);
    //请求新增会员数
    let pageResp = await this.getLeaguerPlusCount(viewData);
    viewData.plusLeaguerCount = pageResp.totalCount;
    //组装页面数据
    viewData = this.buildData(viewData,orderList);
    viewData.loadingFinish = true;
    this.dataReportViewDataMgr.setLeaguerReportViewData(viewData);
  }

}

export class LeaguerReportViewData{
  public leaguerDetailQueryForm = new LeaguerDetailQueryForm();
  //会员数与订单总数
  public memberDataCount: MemberDataCount = new MemberDataCount();
  //会员列表
  public leaguerMap: ZmMap<Leaguer>;
  public memberCardMap: ZmMap<MembershipCard>;
  //页面列表数据
  public leaguerConsumeList: Array<LeaguerCosumeData> = new Array();
  public leaguerConsumeDataList: Array<LeaguerCosumeData> = new Array();

  public plusLeaguerCount: number = 0;//新增会员数
  public consumeCount:number = 0;//消费会员数
  public plusConsumeCount:number = 0;//新增消费数
  public avgPrice:number = 0;//平均客单价

  public avgPriceAsc:boolean = false;//是否升序
  public consumeCountAsc:boolean = false;//是否升序
  public consumeAmountAsc:boolean = false;//是否升序

  //查询参数
  public minTime:any;
  public maxTime:any;

  public page:number;//当前页码
  public recordCount:number;//总记录数

  public loadingFinish:boolean = false;

  constructor(){}
}

export class LeaguerCosumeData{
  public id:string;
  public headImg:string;
  public name:string;
  public phone:string;
  public memberCard:string;
  public avgPrice:number = 0;
  public consumeCount:number = 0;
  public consumeAmount:number = 0;
  public hasConsume:boolean = false;
}
