import {Component, OnInit, OnDestroy, ChangeDetectorRef}from "@angular/core";
import {ArrearagesViewDataMgr} from "../arrearagesViewDataMgr";
import {ArrearageMgr} from "../../../bsModule/arrearage/ArrearageMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {ArrearageQueryForm} from "../../../bsModule/arrearage/apiData/ArrearageQueryForm";
import {PageResp} from "../../../comModule/PageResp";
import {ArrearageGroup} from "../../../bsModule/arrearage/data/ArrearageGroup";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppRouter} from "../../../comModule/AppRouter";

@Component({
  selector: "arrearages_list",
  templateUrl: './arrearagesList.html',
  styleUrls: ['arrearagesList.scss']
})
export class ArrearagesListPage implements OnInit,OnDestroy{

  private viewDataSub:any;
  public viewData:ArrearagesListViewData;
  private service:ArrearagesListService;

  constructor(private arrearageViewDataMgr:ArrearagesViewDataMgr,
              private arrearageMgr:ArrearageMgr,
              private cdRef: ChangeDetectorRef,){
      this.service = new ArrearagesListService(this.arrearageViewDataMgr,this.arrearageMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.arrearageViewDataMgr.subscribeArrearageListVD((viewDataP:ArrearagesListViewData)=>{
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
   * 页面点击事件 根据会员name/phone查询欠款
   */
  findArrearage(){
    if(!AppUtils.isNullObj(this.viewData.queryForm.leaguerNameOrPhone)){
      this.viewData.queryForm.leaguerNameOrPhone = AppUtils.trimBlank(this.viewData.queryForm.leaguerNameOrPhone);
    }
    this.service.getPageData(1,this.viewData);
  }

  /**
   * 页面点击事件 跳转会员欠款详情
   * @param leaguerId
   */
  goArrearageDetail(leaguerId){
    AppRouter.goArrearageDetail(leaguerId);
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    this.service.getPageData(curPage,this.viewData);
  }

}

export class ArrearagesListService{

  constructor(private arrearageViewDataMgr:ArrearagesViewDataMgr,
              private arrearageMgr:ArrearageMgr){

  }

  public initViewData():void{
    let viewDataTmp = new ArrearagesListViewData();
    this.arrearageViewDataMgr.setArrearageListVD(viewDataTmp);

    this.buildViewData((viewDataP:ArrearagesListViewData) =>{
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP:ArrearagesListViewData){
    this.arrearageViewDataMgr.setArrearageListVD(viewDataP);
  }

  /**
   * @param callback
   */
  public async buildViewData(callback:(viewDataP:ArrearagesListViewData) => void){
    let viewDataTmp = new ArrearagesListViewData();
    viewDataTmp.queryForm.storeId = SessionUtil.getInstance().getStoreId();
    viewDataTmp.queryForm.pageItemCount = 10;
    viewDataTmp.queryForm.pageNo = 1;
    let pageResp:PageResp = await this.getData(viewDataTmp.queryForm);
    pageResp.list.sort((a:ArrearageGroup,b:ArrearageGroup)=>{
      return b.totalAmount - a.totalAmount;
    })
    viewDataTmp.page = 1;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.arrearageGroupList = this.filterArrearageGroupList(pageResp.list);
    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getPageData(curPage,viewData){
    viewData.loadingFinish = false;
    viewData.arrearageGroupList = [];
    viewData.queryForm.storeId = SessionUtil.getInstance().getStoreId();
    viewData.queryForm.pageItemCount = 10;
    viewData.queryForm.pageNo = curPage;
    let pageResp:PageResp = await this.getData(viewData.queryForm);
    pageResp.list.sort((a:ArrearageGroup,b:ArrearageGroup)=>{
      return b.totalAmount - a.totalAmount;
    })
    viewData.page = curPage;
    viewData.recordCount = pageResp.totalCount;
    viewData.arrearageGroupList = this.filterArrearageGroupList(pageResp.list);

    viewData.loadingFinish = true;
    this.handleViewData(viewData);
  }

  /**
   * 根据权限过滤显示列表数据
   * @param list
   * @returns {ArrearageGroup[]}
   */
  private filterArrearageGroupList(list: Array<ArrearageGroup>):Array<ArrearageGroup> {
    let arrearageGroupList = new Array<ArrearageGroup>();
    if (SessionUtil.getInstance().getUserPermData().isPhoneAdmin) {
      arrearageGroupList = list;
    } else {
      arrearageGroupList = list.map((item) => {
        item.leaguerPhone = AppUtils.replaceLeaguerPhone(item.leaguerPhone.toString());
        return item;
      });
    }
    return arrearageGroupList;
  }

  /**
   * 请求业务数据
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  private getData(queryForm){
    return this.arrearageMgr.getArrearageGroupPageInfo(queryForm);
  }

}

export class ArrearagesListViewData{
  public queryForm:ArrearageQueryForm = new ArrearageQueryForm;
  public arrearageGroupList:Array<ArrearageGroup> = new Array<ArrearageGroup>();

  public loadingFinish:boolean = false;

  public page:number;//当前页码
  public recordCount:number;//总记录数
}
