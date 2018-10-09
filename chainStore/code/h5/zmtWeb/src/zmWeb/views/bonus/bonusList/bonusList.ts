import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {BonusViewDataMgr} from "../bonusViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {Router} from "@angular/router";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BonusRecord} from "../../../bsModule/bonusRecord/data/BonusRecord";
import {BonusRecordMgr} from "../../../bsModule/bonusRecord/BonusRecordMgr";
import {BonusRecordQueryForm} from "../../../bsModule/bonusRecord/apiData/BonusRecordQueryForm";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {
  BonusRecordDataHelper,
  BuserMonthBonus,
  BuserRoleBonusInfo
} from "../../../bsModule/bonusRecord/data/BonusRecordDataHelper";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {PageResp} from "../../../comModule/PageResp";
import {BonusRecordGroup} from "../../../bsModule/bonusRecord/data/BonusRecordGroup";

/**
 * 提成管理 首页提成列表
 */
@Component({
  selector:'bonus-list',
  templateUrl:'bonusList.html',
  styleUrls:['bonusList.scss']
})

export class BonusListPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: BonusListService;
  public viewData: BonusListViewData;


  constructor(
              private buserMgr:BUserMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private bonusRecordMgr:BonusRecordMgr,
              private bonusViewDataMgr:BonusViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private router:Router){
    this.service = new BonusListService(this.bonusRecordMgr, this.buserMgr, this.storeClerkInfoSynDataHolder, this.bonusViewDataMgr);
  }

  ngOnInit(): void {
      this.viewDataSub = this.bonusViewDataMgr.subscribeBonusListVD((viewDataP:BonusListViewData) => {
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
   * 点击事件 跳转提成详情页面
   * @param buserId
   */
  goBonusDetail(buserId){
    this.router.navigate(['/main/bonus/bonusDetail/'+buserId]);
  }

  findBonusList(){
    this.service.getPageData(1,this.viewData);
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    this.service.getPageData(curPage,this.viewData);
  }

}

export class BonusListService{
  constructor(
    private bonusRecordMgr:BonusRecordMgr,
    private buserMgr:BUserMgr,
    private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
    private bonusViewDataMgr:BonusViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new BonusListViewData();
    this.bonusViewDataMgr.setBonusListViewData(viewDataTmp);

    this.buildViewData((viewDataP:BonusListViewData) =>{
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.bonusViewDataMgr.setBonusListViewData(viewDataP);
  }

  /**
   * 查询storeBonusRecord
   * @param callback
   */
  public async buildViewData(callback:(viewDataP:BonusListViewData) => void){
    let viewDataTmp = new BonusListViewData();
    //初始化查询条件
    let date:Date=new Date();
    viewDataTmp.queryParam = {"year":date.getFullYear(), "month":date.getMonth()+1, "buserName":""};
    let queryForm = this.buildQueryForm(viewDataTmp.queryParam, 1);
    let pageResp:PageResp = await this.bonusRecordMgr.findBonusRecordGroupPageInfo(queryForm);
    pageResp.list.sort((a:BonusRecordGroup,b:BonusRecordGroup)=>{
      return a.buserName > b.buserName?1:-1;
    })
    viewDataTmp.page = 1;
    viewDataTmp.recordCount = pageResp.list.length;
    viewDataTmp.bonusRecordGroupList = pageResp.list;
    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  /**
   * 根据条件查询提成列表
   * @param queryParam
   */
  public async getPageData(curPage:number,viewData:BonusListViewData){
    let queryForm = this.buildQueryForm(viewData.queryParam, curPage);
    let pageResp:PageResp = await this.bonusRecordMgr.findBonusRecordGroupPageInfo(queryForm);
    pageResp.list.sort((a:BonusRecordGroup,b:BonusRecordGroup)=>{
      return a.buserName > b.buserName?1:-1;
    })
    viewData.page = 1;
    viewData.recordCount = pageResp.list.length;
    viewData.bonusRecordGroupList = pageResp.list;
    viewData.loadingFinish = true;
    this.handleViewData(viewData);
  }

  /**
   * 构造查新参数
   * @param queryParam
   * @param curPage
   * @returns {BonusRecordQueryForm}
   */
  private buildQueryForm(queryParam, curPage: number):BonusRecordQueryForm{
    let queryForm = new BonusRecordQueryForm();
    queryForm.storeId = SessionUtil.getInstance().getStoreId();

    queryParam.year = Number(queryParam.year);
    queryParam.month = Number(queryParam.month);

    let minDate = {year: queryParam.year, month: queryParam.month, day: 1};
    queryForm.minTime = AppUtils.getMinTime(minDate);
    let maxDate = {year: queryParam.year, month: queryParam.month+1, day: 1};
    queryForm.maxTime = AppUtils.getMinTime(maxDate);

    queryForm.buserName = queryParam.buserName;
    queryForm.pageNo = curPage;
    queryForm.pageItemCount = 10;
    return queryForm;
  }

}

export class BonusListViewData{
  //固定年月
  public years=[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026];
  public months=[1,2,3,4,5,6,7,8,9,10,11,12];
  //查询参数
  public queryParam:any={"year":2017,"month":11,"buserName":""};

  public bonusRecordGroupList:Array<BonusRecordGroup>;

  public loadingFinish :boolean = false;

  public page:number;//当前页码
  public recordCount:number;//总记录数
}
