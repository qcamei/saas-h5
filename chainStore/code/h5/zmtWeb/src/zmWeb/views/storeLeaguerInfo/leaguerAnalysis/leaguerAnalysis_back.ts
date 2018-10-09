// import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
// import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
// import {SessionUtil} from "../../../comModule/session/SessionUtil";
// import {StoreLeaguerInfoViewDataMgr} from "../StoreLeaguerInfoViewDataMgr";
// import {AppRouter} from "../../../comModule/AppRouter";
// import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
// import {LeaguerDetailQueryForm} from "../../../bsModule/leaguerDetail/apiData/LeaguerDetailQueryForm";
// import {PageResp} from "../../../comModule/PageResp";
// import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
// import {MatDialog} from "@angular/material";
// import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
// import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
// import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
// import {StoreCardInfo} from "../../../bsModule/storeCardInfo/data/StoreCardInfo";
// import {Constants} from "../../common/Util/Constants";
// import {LeaguerTypeEnum} from "../../../bsModule/leaguerDetail/data/LeaguerTypeEnum";
// import {SortTypeEnum} from "../../../bsModule/leaguerDetail/data/SortTypeEnum";
// import {SortEnum} from "../../../comModule/enum/SortEnum";
// import {LeaguerCardMgr} from "../../../bsModule/leaguerCard/LeaguerCardMgr";
// import {LeaguerCard} from "../../../bsModule/leaguerCard/data/LeaguerCard";
// import {LeaguerCardQueryForm} from "../../../bsModule/leaguerCard/apiData/LeaguerCardQueryForm";
// import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
// import {LoadDataEnum} from "../../../comModule/enum/LoadDataEnum";
// import {PrdCardType} from "../../../bsModule/storeCardInfo/data/PrdCardType";
//
// /**
//  * 会员管理 会员分析
//  */
// @Component({
//   selector:'leaguer-analysis',
//   templateUrl:'leaguerAnalysis.html',
//   styleUrls:['leaguerAnalysis.scss'],
//   changeDetection:ChangeDetectionStrategy.OnPush
// })
//
// export class LeaguerAnalysisPage implements OnInit,OnDestroy{
//
//   private viewDataSub: any;
//   private service: LeaguerAnalysisService;
//   public viewData: LeaguerAnalysisViewData;
//   public myModal:any;
//
//   constructor(private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,
//               private leaguerDetailMgr:LeaguerDetailMgr,
//               private leaguerCardMgr:LeaguerCardMgr,
//               private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
//               private cdRef: ChangeDetectorRef,
//               private matDialog: MatDialog){
//     ZmModalMgr.getInstance().reset(matDialog);
//     this.service = new LeaguerAnalysisService(this.leaguerDetailMgr,this.leaguerCardMgr,this.storeCardInfoSynDataHolder,this.storeLeaguerInfoViewDataMgr);
//   }
//
//   ngOnInit(): void {
//     this.viewDataSub = this.storeLeaguerInfoViewDataMgr.subscribeLeaguerAnalysisVD((viewDataP:LeaguerAnalysisViewData) => {
//         this.viewData = viewDataP;
//         this.cdRef.markForCheck();
//       })
//     this.service.initViewData();
//   }
//
//   ngOnDestroy(): void {
//     if(!AppUtils.isNullObj(this.viewDataSub)){
//       this.viewDataSub.unsubscribe();
//     }
//   }
//
//   /**
//    * 切换tab
//    * @param event
//    */
//   switchTab(event){
//     let index = event.index;
//     this.viewData.queryForm = new LeaguerDetailQueryForm();
//     if(index == 0){
//       this.viewData.queryForm.leaguerType = LeaguerTypeEnum.HIGH_GRADE_CUSTOMER;
//       this.viewData.queryForm.sortType = SortTypeEnum.MonthRate;
//       this.viewData.queryForm.sort = SortEnum.DESC;
//       this.findLeaguer();
//     }else if(index == 1){
//       this.viewData.leaguerCardQueryForm = new LeaguerCardQueryForm();
//       this.viewData.leaguerCardQueryForm.sort = SortEnum.ASE;
//       this.viewData.cardTypeId = Constants.DEFAULT_TYPE_VALUE;
//       this.findLeaguerCard();
//     }else if(index == 2){
//       this.viewData.queryForm.leaguerType = LeaguerTypeEnum.ALL;
//       this.viewData.queryForm.sortType = SortTypeEnum.MemberCardEndTime;
//       this.viewData.queryForm.sort = SortEnum.ASE;
//       this.findLeaguer();
//     }else if(index == 3){
//       this.viewData.queryForm.leaguerType = LeaguerTypeEnum.ALL;
//       this.viewData.queryForm.sortType = SortTypeEnum.MemberCardBalance;
//       this.viewData.queryForm.sort = SortEnum.ASE;
//       this.findLeaguer();
//     }
//   }
//
//   /**
//    * 切换会员类型
//    */
//   changeLeaguerType(event){
//     this.viewData.queryForm.leaguerType = event;
//     this.findLeaguer();
//   }
//
//   /**
//    * 切换会员卡过期状态
//    * @param event
//    */
//   changeMemberCardState(event){
//     this.viewData.queryForm.memberCardExpiredState = event;
//     this.findLeaguer();
//   }
//
//   /**
//    * 消费时间排序
//    * @param sortNum
//    */
//   sortConsumeTime(sortNum:number){
//     this.viewData.queryForm.sortType = SortTypeEnum.LastConsumeTime;
//     this.viewData.queryForm.sort = sortNum;
//     this.viewData.consumeTimeSort = sortNum;
//     this.viewData.monthRateSort = undefined;
//     this.viewData.avgPriceSort = undefined;
//     this.findLeaguer();
//   }
//
//   /**
//    * 来店频率排序
//    * @param sortNum
//    */
//   sortMonthRate(sortNum:number){
//     this.viewData.queryForm.sortType = SortTypeEnum.MonthRate;
//     this.viewData.queryForm.sort = sortNum;
//     this.viewData.consumeTimeSort = undefined;
//     this.viewData.monthRateSort = sortNum;
//     this.viewData.avgPriceSort = undefined;
//     this.findLeaguer();
//   }
//
//   /**
//    * 客单价排序
//    * @param sortNum
//    */
//   sortAvgPrice(sortNum:number){
//     this.viewData.queryForm.sortType = SortTypeEnum.AvgPrice;
//     this.viewData.queryForm.sort = sortNum;
//     this.viewData.consumeTimeSort = undefined;
//     this.viewData.monthRateSort = undefined;
//     this.viewData.avgPriceSort = sortNum;
//     this.findLeaguer();
//   }
//
//   /**
//    * 会员卡到期时间排序
//    * @param sortNum
//    */
//   sortMemberCardEndTime(sortNum:number){
//     this.viewData.queryForm.sortType = SortTypeEnum.MemberCardEndTime;
//     this.viewData.queryForm.sort = sortNum;
//     this.viewData.memberCardEndTimeSort = sortNum;
//     this.findLeaguer();
//   }
//
//   /**
//    * 会员卡余额排序
//    * @param sortNum
//    */
//   sortMemberCardBalance(sortNum:number){
//     this.viewData.queryForm.sortType = SortTypeEnum.MemberCardBalance;
//     this.viewData.queryForm.sort = sortNum;
//     this.viewData.memberCardBalanceSort = sortNum;
//     this.findLeaguer();
//   }
//
//   /**
//    * 查询会员 页面点击事件
//    */
//   findLeaguer(){
//     this.viewData.queryForm.leaguerNameOrPhone = AppUtils.isNullOrWhiteSpace(this.viewData.queryForm.leaguerNameOrPhone)?"":AppUtils.trimBlank(this.viewData.queryForm.leaguerNameOrPhone);
//     this.getPageData(1);
//   }
//
//   /**
//    * 次卡到期时间排序
//    * @param sortNum
//    */
//   sortCardEndTime(sortNum:number){
//     this.viewData.leaguerCardQueryForm.sort = sortNum;
//     this.viewData.cardEndTimeSort = sortNum;
//     this.findLeaguerCard();
//   }
//
//   /**
//    * 刷新次卡列表
//    */
//   refreshLeaguerCardList(){
//     this.viewData.leaguerCardQueryForm.loadType = LoadDataEnum.DB;
//     this.getCardPageData(1);
//   }
//
//   /**
//    * 查询即将过期次卡 页面点击事件
//    */
//   findLeaguerCard(){
//     this.viewData.leaguerCardQueryForm.leaguerNameOrPhone = AppUtils.isNullOrWhiteSpace(this.viewData.leaguerCardQueryForm.leaguerNameOrPhone)?"":AppUtils.trimBlank(this.viewData.leaguerCardQueryForm.leaguerNameOrPhone);
//     this.viewData.leaguerCardQueryForm.cardTypeId = this.viewData.cardTypeId==Constants.DEFAULT_TYPE_VALUE?"":this.viewData.cardTypeId;
//     this.getCardPageData(1);
//   }
//
//   /**
//    * 会员卡到期剩余天数
//    * @param item
//    * @returns {string}
//    */
//   getMemberCardRestDay(item:LeaguerDetail):string{
//     if(AppUtils.isNullOrWhiteSpace(item.leaguerMemberCard.cardId)){
//       return "-";
//     }else{
//       let endTime = parseInt(item.leaguerMemberCard.endTime);
//       let curTime = new Date().getTime();
//       if((endTime - curTime)>0){
//         return Math.round((endTime - curTime)/Constants.ONEDAY_TIMESTAMP)+'天';
//       }else{
//         return "已过期";
//       }
//     }
//   }
//
//   /**
//    * 次卡到期天数
//    * @param endTime
//    * @returns {any}
//    */
//   getCardRestDay(endTime:number):string{
//     let curTime = new Date().getTime();
//     if((endTime - curTime)>0){
//       return Math.round((endTime - curTime)/Constants.ONEDAY_TIMESTAMP)+'天';
//     }else{
//       return "已过期";
//     }
//   }
//
//   /**
//    * 点击事件 跳转会员详情页面
//    * @param leaguerId
//    */
//   goLeaguerDetail(leaguerId){
//     AppRouter.goLeaguerDetail(leaguerId);
//   }
//
//   /**
//    * 分页过滤数据
//    */
//   getPageData(curPage){
//     this.service.getPageData(curPage,this.viewData);
//   }
//
//   /**
//    * 分页过滤数据
//    */
//   getCardPageData(curPage){
//     this.service.getCardPageData(curPage,this.viewData);
//   }
//
// }
//
// export class LeaguerAnalysisService{
//   constructor(private leaguerDetailMgr:LeaguerDetailMgr,
//               private leaguerCardMgr:LeaguerCardMgr,
//               private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
//               private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr){}
//
//   public initViewData():void{
//     let viewDataTmp = new LeaguerAnalysisViewData();
//     this.storeLeaguerInfoViewDataMgr.setLeaguerAnalysisViewData(viewDataTmp);
//
//     this.buildViewData();
//   }
//
//   public async buildViewData(){
//     let viewDataTmp = new LeaguerAnalysisViewData();
//     let storeId = SessionUtil.getInstance().getStoreId();
//
//     viewDataTmp.queryForm.storeId = storeId;
//     viewDataTmp.queryForm.pageItemCount = 10;
//     viewDataTmp.queryForm.pageNo = 1;
//     viewDataTmp.queryForm.leaguerType = LeaguerTypeEnum.HIGH_GRADE_CUSTOMER;
//     viewDataTmp.queryForm.sortType = SortTypeEnum.LastConsumeTime;
//     viewDataTmp.queryForm.sort = SortEnum.DESC;
//     let pageResp:PageResp = await this.leaguerDetailMgr.getLeaguerDetailPageInfo(viewDataTmp.queryForm);
//     if(!AppUtils.isNullObj(pageResp)){
//       viewDataTmp.leaguerList = pageResp.list.map((item:LeaguerDetail)=>{
//         return item.encryptLeaguerDetail4New();
//       });
//       viewDataTmp.page = pageResp.pageNo;
//       viewDataTmp.recordCount = pageResp.totalCount;
//
//       let storeCardInfo:StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
//       if(!AppUtils.isNullObj(storeCardInfo)){
//         viewDataTmp.memberCardMap = storeCardInfo.getMemberCardMap();
//         viewDataTmp.productCardTypeList = storeCardInfo.getAllProductCardTypeMap().values();
//       }
//     }
//
//     viewDataTmp.loadingFinish = true;
//     this.storeLeaguerInfoViewDataMgr.setLeaguerAnalysisViewData(viewDataTmp);
//   }
//
//   /**
//    * 获取分页数据
//    * @param curPage
//    * @param viewData
//    */
//   public async getPageData(curPage:number,viewData:LeaguerAnalysisViewData){
//     viewData.loadingFinish = false;
//     viewData.leaguerList = [];
//     let storeId = SessionUtil.getInstance().getStoreId();
//     viewData.queryForm.storeId = storeId;
//     viewData.queryForm.pageItemCount = 10;
//     viewData.queryForm.pageNo = curPage;
//     let pageResp:PageResp = await this.leaguerDetailMgr.getLeaguerDetailPageInfo(viewData.queryForm);
//     if(!AppUtils.isNullObj(pageResp)){
//       viewData.leaguerList = pageResp.list.map((item:LeaguerDetail)=>{
//         return item.encryptLeaguerDetail4New();
//       });
//       viewData.page = pageResp.pageNo;
//       viewData.recordCount = pageResp.totalCount;
//     }
//
//     viewData.loadingFinish = true;
//     this.storeLeaguerInfoViewDataMgr.setLeaguerAnalysisViewData(viewData);
//   }
//
//   /**
//    * 获取次卡分页数据
//    * @param curPage
//    * @param viewData
//    */
//   public async getCardPageData(curPage:number,viewData:LeaguerAnalysisViewData){
//     viewData.loadingFinish = false;
//     viewData.leaguerCardList = [];
//     let storeId = SessionUtil.getInstance().getStoreId();
//     viewData.leaguerCardQueryForm.storeId = storeId;
//     viewData.leaguerCardQueryForm.pageItemCount = 10;
//     viewData.leaguerCardQueryForm.pageNo = curPage;
//     let leaguerCardPageResp:PageResp = await this.leaguerCardMgr.getExpiredCardPageInfo(viewData.leaguerCardQueryForm);
//     if(!AppUtils.isNullObj(leaguerCardPageResp)){
//       viewData.leaguerCardList = leaguerCardPageResp.list.map((item:LeaguerCard)=>{
//         item.leaguerPhone = AppUtils.replaceLeaguerPhone(item.leaguerPhone);
//         return item;
//       });
//       viewData.cardPage = leaguerCardPageResp.pageNo;
//       viewData.cardRecordCount = leaguerCardPageResp.totalCount;
//     }
//
//     viewData.leaguerCardQueryForm.loadType = LoadDataEnum.CACHE;
//     viewData.loadingFinish = true;
//     this.storeLeaguerInfoViewDataMgr.setLeaguerAnalysisViewData(viewData);
//   }
//
// }
//
// export class LeaguerAnalysisViewData{
//   public memberCardMap:ZmMap<MembershipCard> = new ZmMap<MembershipCard>();
//   public productCardTypeList:Array<PrdCardType> = new Array<PrdCardType>();
//   public leaguerList:Array<LeaguerDetail> = new Array()//查询结果列表
//   public leaguerCardList:Array<LeaguerCard> = new Array()//即将过期次卡结果列表
//
//   public page:number;//当前页码
//   public recordCount:number;//总记录数
//   public cardPage:number;//次卡当前页码
//   public cardRecordCount:number;//次卡总记录数
//   public loadingFinish :boolean = false;
//
//   public queryForm = new LeaguerDetailQueryForm();
//   public consumeTimeSort:number = SortEnum.DESC;
//   public monthRateSort:number;
//   public avgPriceSort:number;
//   public memberCardEndTimeSort:number = SortEnum.ASE;
//   public memberCardBalanceSort:number = SortEnum.ASE;
//
//   public leaguerCardQueryForm = new LeaguerCardQueryForm();
//   public cardTypeId = Constants.DEFAULT_TYPE_VALUE;
//   public cardEndTimeSort:number = SortEnum.ASE;
//
//   constructor(){
//     this.queryForm.leaguerType = LeaguerTypeEnum.HIGH_GRADE_CUSTOMER;//默认优质会员
//   }
// }
//
//
