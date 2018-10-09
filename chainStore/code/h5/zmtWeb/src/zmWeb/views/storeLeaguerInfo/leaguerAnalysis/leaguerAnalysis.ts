import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreLeaguerInfoViewDataMgr} from "../StoreLeaguerInfoViewDataMgr";
import {AppRouter} from "../../../comModule/AppRouter";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {LeaguerDetailQueryForm} from "../../../bsModule/leaguerDetail/apiData/LeaguerDetailQueryForm";
import {PageResp} from "../../../comModule/PageResp";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StoreCardInfo} from "../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {Constants} from "../../common/Util/Constants";
import {LeaguerTypeEnum} from "../../../bsModule/leaguerDetail/data/LeaguerTypeEnum";
import {SortTypeEnum} from "../../../bsModule/leaguerDetail/data/SortTypeEnum";
import {SortEnum} from "../../../comModule/enum/SortEnum";
import {LeaguerCardMgr} from "../../../bsModule/leaguerCard/LeaguerCardMgr";
import {LeaguerCard} from "../../../bsModule/leaguerCard/data/LeaguerCard";
import {LeaguerCardQueryForm} from "../../../bsModule/leaguerCard/apiData/LeaguerCardQueryForm";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {LoadDataEnum} from "../../../comModule/enum/LoadDataEnum";
import {PrdCardType} from "../../../bsModule/storeCardInfo/data/PrdCardType";

/**
 * 会员管理 会员分析
 */
@Component({
  selector:'leaguer-analysis',
  templateUrl:'leaguerAnalysis.html',
  styleUrls:['leaguerAnalysis.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class LeaguerAnalysisPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: LeaguerAnalysisService;
  public viewData: LeaguerAnalysisViewData;
  public myModal:any;

  constructor(private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,
              private leaguerDetailMgr:LeaguerDetailMgr,
              private leaguerCardMgr:LeaguerCardMgr,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog){
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new LeaguerAnalysisService(this.leaguerDetailMgr,this.leaguerCardMgr,this.storeCardInfoSynDataHolder,this.storeLeaguerInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeLeaguerInfoViewDataMgr.subscribeLeaguerAnalysisVD((viewDataP:LeaguerAnalysisViewData) => {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      })
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 切换tab
   * @param event
   */
  switchTab(event){
    let index = event.index;
    if(index == 0){
      this.getTypePageData(1);
    }else if(index == 1){
      this.getCardPageData(1);
    }else if(index == 2){
      this.getMemberCardPageData(1);
    }else if(index == 3){
      this.getBalancePageData(1);
    }
  }

  /**
   * 切换会员类型
   */
  changeLeaguerType(event){
    this.viewData.typeQueryForm.leaguerType = event;
    this.getTypePageData(1);
  }

  /**
   * 消费时间排序
   * @param sortNum
   */
  sortConsumeTime(sortNum:number){
    this.viewData.typeQueryForm.sortType = SortTypeEnum.LastConsumeTime;
    this.viewData.typeQueryForm.sort = sortNum;
    this.viewData.consumeTimeSort = sortNum;
    this.viewData.monthRateSort = undefined;
    this.viewData.avgPriceSort = undefined;
    this.getTypePageData(1);
  }

  /**
   * 来店频率排序
   * @param sortNum
   */
  sortMonthRate(sortNum:number){
    this.viewData.typeQueryForm.sortType = SortTypeEnum.MonthRate;
    this.viewData.typeQueryForm.sort = sortNum;
    this.viewData.consumeTimeSort = undefined;
    this.viewData.monthRateSort = sortNum;
    this.viewData.avgPriceSort = undefined;
    this.getTypePageData(1);
  }

  /**
   * 客单价排序
   * @param sortNum
   */
  sortAvgPrice(sortNum:number){
    this.viewData.typeQueryForm.sortType = SortTypeEnum.AvgPrice;
    this.viewData.typeQueryForm.sort = sortNum;
    this.viewData.consumeTimeSort = undefined;
    this.viewData.monthRateSort = undefined;
    this.viewData.avgPriceSort = sortNum;
    this.getTypePageData(1);
  }

  /**
   * 会员类型分页过滤数据
   */
  getTypePageData(curPage){
    this.viewData.typeQueryForm.leaguerNameOrPhone = AppUtils.isNullOrWhiteSpace(this.viewData.typeQueryForm.leaguerNameOrPhone)?"":AppUtils.trimBlank(this.viewData.typeQueryForm.leaguerNameOrPhone);
    this.service.getTypePageData(curPage,this.viewData);
  }

  /**
   * 切换会员卡过期状态
   * @param event
   */
  changeMemberCardState(event){
    this.viewData.memberCardQueryForm.memberCardExpiredState = event;
    this.getMemberCardPageData(1);
  }

  /**
   * 会员卡到期时间排序
   * @param sortNum
   */
  sortMemberCardEndTime(sortNum:number){
    this.viewData.memberCardQueryForm.sort = sortNum;
    this.viewData.memberCardEndTimeSort = sortNum;
    this.getMemberCardPageData(1);
  }

  /**
   * 会员卡即将到期分页过滤数据
   */
  getMemberCardPageData(curPage){
    this.viewData.memberCardQueryForm.leaguerNameOrPhone = AppUtils.isNullOrWhiteSpace(this.viewData.memberCardQueryForm.leaguerNameOrPhone)?"":AppUtils.trimBlank(this.viewData.memberCardQueryForm.leaguerNameOrPhone);
    this.service.getMemberCardPageData(curPage,this.viewData);
  }

  /**
   * 会员卡余额排序
   * @param sortNum
   */
  sortMemberCardBalance(sortNum:number){
    this.viewData.balanceQueryForm.sort = sortNum;
    this.viewData.memberCardBalanceSort = sortNum;
    this.getBalancePageData(1);
  }

  /**
   * 会员卡余额不足分页过滤数据
   */
  getBalancePageData(curPage){
    this.viewData.balanceQueryForm.leaguerNameOrPhone = AppUtils.isNullOrWhiteSpace(this.viewData.balanceQueryForm.leaguerNameOrPhone)?"":AppUtils.trimBlank(this.viewData.balanceQueryForm.leaguerNameOrPhone);
    this.service.getBalancePageData(curPage,this.viewData);
  }

  /**
   * 次卡到期时间排序
   * @param sortNum
   */
  sortCardEndTime(sortNum:number){
    this.viewData.leaguerCardQueryForm.sort = sortNum;
    this.viewData.cardEndTimeSort = sortNum;
    this.getCardPageData(1);
  }

  /**
   * 刷新次卡列表
   */
  refreshCardList(){
    this.viewData.leaguerCardQueryForm.loadType = LoadDataEnum.DB;
    this.getCardPageData(1);
  }

  /**
   * 次卡即将过期分页过滤数据
   */
  getCardPageData(curPage){
    this.viewData.leaguerCardQueryForm.leaguerNameOrPhone = AppUtils.isNullOrWhiteSpace(this.viewData.leaguerCardQueryForm.leaguerNameOrPhone)?"":AppUtils.trimBlank(this.viewData.leaguerCardQueryForm.leaguerNameOrPhone);
    this.viewData.leaguerCardQueryForm.cardTypeId = this.viewData.cardTypeId==Constants.DEFAULT_TYPE_VALUE?"":this.viewData.cardTypeId;
    this.service.getCardPageData(curPage,this.viewData);
  }

  /**
   * 会员卡到期剩余天数
   * @param item
   * @returns {string}
   */
  getMemberCardRestDay(item:LeaguerDetail):string{
    if(AppUtils.isNullOrWhiteSpace(item.leaguerMemberCard.cardId)){
      return "-";
    }else{
      let endTime = parseInt(item.leaguerMemberCard.endTime);
      let curTime = new Date().getTime();
      if((endTime - curTime)>0){
        return Math.round((endTime - curTime)/Constants.ONEDAY_TIMESTAMP)+'天';
      }else{
        return "已过期";
      }
    }
  }

  /**
   * 次卡到期天数
   * @param endTime
   * @returns {any}
   */
  getCardRestDay(endTime:number):string{
    let curTime = new Date().getTime();
    if((endTime - curTime)>0){
      return Math.round((endTime - curTime)/Constants.ONEDAY_TIMESTAMP)+'天';
    }else{
      return "已过期";
    }
  }

  /**
   * 点击事件 跳转会员详情页面
   * @param leaguerId
   */
  goLeaguerDetail(leaguerId){
    AppRouter.goLeaguerDetail(leaguerId);
  }

}

export class LeaguerAnalysisService{
  constructor(private leaguerDetailMgr:LeaguerDetailMgr,
              private leaguerCardMgr:LeaguerCardMgr,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new LeaguerAnalysisViewData();
    this.storeLeaguerInfoViewDataMgr.setLeaguerAnalysisViewData(viewDataTmp);

    this.buildViewData();
  }

  public async buildViewData(){
    let viewDataTmp = new LeaguerAnalysisViewData();
    let storeId = SessionUtil.getInstance().getStoreId();

    viewDataTmp.typeQueryForm.storeId = storeId;
    let pageResp:PageResp = await this.leaguerDetailMgr.getLeaguerDetailPageInfo(viewDataTmp.typeQueryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewDataTmp.typeList = pageResp.list.map((item:LeaguerDetail)=>{
        return item.encryptLeaguerDetail4New();
      });
      viewDataTmp.page = pageResp.pageNo;
      viewDataTmp.recordCount = pageResp.totalCount;

      let storeCardInfo:StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
      if(!AppUtils.isNullObj(storeCardInfo)){
        viewDataTmp.memberCardMap = storeCardInfo.getMemberCardMap();
        viewDataTmp.productCardTypeList = storeCardInfo.getAllProductCardTypeMap().values();
      }
    }

    viewDataTmp.loadingFinish = true;
    this.storeLeaguerInfoViewDataMgr.setLeaguerAnalysisViewData(viewDataTmp);
  }

  /**
   * 获取会员类型分页数据
   * @param curPage
   * @param viewData
   */
  public async getTypePageData(curPage:number,viewData:LeaguerAnalysisViewData){
    viewData.loadingFinish = false;
    viewData.typeList = [];
    let storeId = SessionUtil.getInstance().getStoreId();
    viewData.typeQueryForm.storeId = storeId;
    viewData.typeQueryForm.pageNo = curPage;
    let pageResp:PageResp = await this.leaguerDetailMgr.getLeaguerDetailPageInfo(viewData.typeQueryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewData.typeList = pageResp.list.map((item:LeaguerDetail)=>{
        return item.encryptLeaguerDetail4New();
      });
      viewData.page = pageResp.pageNo;
      viewData.recordCount = pageResp.totalCount;
    }

    viewData.loadingFinish = true;
    this.storeLeaguerInfoViewDataMgr.setLeaguerAnalysisViewData(viewData);
  }

  /**
   * 获取会员卡即将到期分页数据
   * @param curPage
   * @param viewData
   */
  public async getMemberCardPageData(curPage:number,viewData:LeaguerAnalysisViewData){
    viewData.loadingFinish = false;
    viewData.memberCardList = [];
    let storeId = SessionUtil.getInstance().getStoreId();
    viewData.memberCardQueryForm.storeId = storeId;
    viewData.memberCardQueryForm.pageNo = curPage;
    let pageResp:PageResp = await this.leaguerDetailMgr.getLeaguerDetailPageInfo(viewData.memberCardQueryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewData.memberCardList = pageResp.list.map((item:LeaguerDetail)=>{
        return item.encryptLeaguerDetail4New();
      });
      viewData.memberCardPage = pageResp.pageNo;
      viewData.memberCardRecordCount = pageResp.totalCount;
    }

    viewData.loadingFinish = true;
    this.storeLeaguerInfoViewDataMgr.setLeaguerAnalysisViewData(viewData);
  }

  /**
   * 获取会员卡余额不足分页数据
   * @param curPage
   * @param viewData
   */
  public async getBalancePageData(curPage:number,viewData:LeaguerAnalysisViewData){
    viewData.loadingFinish = false;
    viewData.balanceList = [];
    let storeId = SessionUtil.getInstance().getStoreId();
    viewData.balanceQueryForm.storeId = storeId;
    viewData.balanceQueryForm.pageNo = curPage;
    let pageResp:PageResp = await this.leaguerDetailMgr.getLeaguerDetailPageInfo(viewData.balanceQueryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewData.balanceList = pageResp.list.map((item:LeaguerDetail)=>{
        return item.encryptLeaguerDetail4New();
      });
      viewData.balancePage = pageResp.pageNo;
      viewData.balanceRecordCount = pageResp.totalCount;
    }

    viewData.loadingFinish = true;
    this.storeLeaguerInfoViewDataMgr.setLeaguerAnalysisViewData(viewData);
  }

  /**
   * 获取次卡即将到期分页数据
   * @param curPage
   * @param viewData
   */
  public async getCardPageData(curPage:number,viewData:LeaguerAnalysisViewData){
    viewData.loadingFinish = false;
    viewData.cardList = [];
    let storeId = SessionUtil.getInstance().getStoreId();
    viewData.leaguerCardQueryForm.storeId = storeId;
    viewData.leaguerCardQueryForm.pageNo = curPage;
    let leaguerCardPageResp:PageResp = await this.leaguerCardMgr.getExpiredCardPageInfo(viewData.leaguerCardQueryForm);
    if(!AppUtils.isNullObj(leaguerCardPageResp)){
      viewData.cardList = leaguerCardPageResp.list.map((item:LeaguerCard)=>{
        item.leaguerPhone = AppUtils.replaceLeaguerPhone(item.leaguerPhone);
        return item;
      });
      viewData.cardPage = leaguerCardPageResp.pageNo;
      viewData.cardRecordCount = leaguerCardPageResp.totalCount;
    }

    viewData.leaguerCardQueryForm.loadType = LoadDataEnum.CACHE;
    viewData.loadingFinish = true;
    this.storeLeaguerInfoViewDataMgr.setLeaguerAnalysisViewData(viewData);
  }

}

export class LeaguerAnalysisViewData{
  /***********************************会员类型******************************************/
  public typeList:Array<LeaguerDetail> = new Array<LeaguerDetail>();//查询结果列表
  public page:number;//当前页码
  public recordCount:number;//总记录数

  public typeQueryForm = new LeaguerDetailQueryForm();
  public consumeTimeSort:number = SortEnum.DESC;
  public monthRateSort:number;
  public avgPriceSort:number;
  public memberCardEndTimeSort:number = SortEnum.ASE;
  public memberCardBalanceSort:number = SortEnum.ASE;

  /***********************************次卡即将过期******************************************/
  public productCardTypeList:Array<PrdCardType> = new Array<PrdCardType>();
  public cardList:Array<LeaguerCard> = new Array<LeaguerCard>();
  public cardPage:number;//次卡当前页码
  public cardRecordCount:number;//次卡总记录数

  public leaguerCardQueryForm = new LeaguerCardQueryForm();
  public cardTypeId = Constants.DEFAULT_TYPE_VALUE;
  public cardEndTimeSort:number = SortEnum.ASE;

  /***********************************会员卡即将过期******************************************/
  public memberCardMap:ZmMap<MembershipCard> = new ZmMap<MembershipCard>();
  public memberCardList:Array<LeaguerDetail> = new Array<LeaguerDetail>();
  public memberCardPage:number;//次卡当前页码
  public memberCardRecordCount:number;//次卡总记录数
  public memberCardQueryForm = new LeaguerDetailQueryForm();

  /***********************************会员余额不足******************************************/
  public balanceList:Array<LeaguerDetail> = new Array<LeaguerDetail>();
  public balancePage:number;//次卡当前页码
  public balanceRecordCount:number;//次卡总记录数
  public balanceQueryForm = new LeaguerDetailQueryForm();

  public loadingFinish :boolean = false;

  constructor(){
    this.typeQueryForm.leaguerType = LeaguerTypeEnum.HIGH_GRADE_CUSTOMER;//默认优质会员
    this.typeQueryForm.sortType = SortTypeEnum.LastConsumeTime;
    this.typeQueryForm.sort = SortEnum.DESC;

    this.memberCardQueryForm.sortType = SortTypeEnum.MemberCardEndTime;
    this.memberCardQueryForm.sort = SortEnum.ASE;

    this.balanceQueryForm.sortType = SortTypeEnum.MemberCardBalance;
    this.balanceQueryForm.sort = SortEnum.ASE;
  }
}


