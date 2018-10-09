
import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {VipLevelMgr} from "../../../bsModule/vipLevel/VipLevelMgr";
import {ActivatedRoute, Router} from "@angular/router";
import {AppUtils} from "../../../comModule/AppUtils";
import {VipLevel} from "../../../bsModule/vipLevel/data/VipLevel";
import {VipLevelViewDataMgr} from "../VipLevelViewDataMgr";
import {UpdateVipLevelStateForm} from "../../../bsModule/vipLevel/apiData/UpdateVipLevelStateForm";
import {VipLevelStateEnum} from "../../../bsModule/vipLevel/data/VipLevelStateEnum";
import {Popup} from "../../common/popup/popup";
import {Constants} from "../../common/Util/Constants";
import {PageResp} from "../../../comModule/PageResp";
import {AppRouter} from "../../../comModule/AppRouter";
import {QueryVipLevelForm} from "../../../bsModule/vipLevel/apiData/QueryVipLevelForm";
import {VipLevelType} from "../../../bsModule/vipLevelType/data/VipLevelType";
import {VipLevelTypeMgr} from "../../../bsModule/vipLevelType/VipLevelTypeMgr";
import {QueryVipLevelTypeForm} from "../../../bsModule/vipLevelType/apiData/QueryVipLevelTypeForm";

@Component({
  selector: 'vipLevel-list',
  templateUrl: 'vipLevelList.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class VipLevelListPage implements OnInit,OnDestroy {
  private service: VipLevelListService;
  public  viewData: VipLevelListViewData;
  private viewDataSub: any;

  constructor(private vipLevelMgr: VipLevelMgr,
              private vipLevelTypeMgr: VipLevelTypeMgr,
              private vipLevelViewDataMgr: VipLevelViewDataMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              public router: Router) {

    this.service = new VipLevelListService(this.vipLevelMgr, this.vipLevelTypeMgr, this.vipLevelViewDataMgr);
  }


  ngOnInit() {
    this.viewDataSub = this.vipLevelViewDataMgr.subscribeVipLevelListVD((viewDataP: VipLevelListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.viewData = new VipLevelListViewData();
    this.service.initViewData(this.viewData.queryParamsVD);
  }

  ngOnDestroy() {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  goAddPage(){
    AppRouter.goAddVipLevelPage();
  }

  queryListByParams(){
    this.viewData.queryParamsVD.curPage = Constants.DEFAULT_PAGENO;
    this.service.initViewData(this.viewData.queryParamsVD);
  }

  getPageData(curPage){
    this.viewData.queryParamsVD.curPage = curPage;
    this.service.initViewData(this.viewData.queryParamsVD);
  }

  goEditPage(vipLevelId:number){
    AppRouter.goEditVipLevelPage(vipLevelId);
  }

  changeState(vipLevelId, state) {
    let content = "";
    state == VipLevelStateEnum.OPEN ? content = "上架" : content = "下架";
    Popup.getInstance().open("提示", "确定" + content + "吗？", () => {
      this.service.updateState(vipLevelId, state).then(
        (success) => {
          if (success) {
            AppUtils.showSuccess("提示", content + "成功");
            this.viewData.queryParamsVD.curPage = Constants.DEFAULT_PAGENO;
            this.service.initViewData(this.viewData.queryParamsVD);
          }
          else {
            AppUtils.showError("提示", content + "失败");
          }
        }
      );
    });

  }

}

class VipLevelListService {

  constructor(private vipLevelMgr: VipLevelMgr,
              private vipLevelTypeMgr: VipLevelTypeMgr,
              private vipLevelViewDataMgr: VipLevelViewDataMgr) {
  }

  public initViewData(queryParamsVD: QueryParamsVD) :void{
    this.vipLevelViewDataMgr.setVipLevelListViewData(new VipLevelListViewData());
    this.buildViewData(queryParamsVD).then(
      (viewDataTmp: VipLevelListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: VipLevelListViewData) {
    this.vipLevelViewDataMgr.setVipLevelListViewData(viewDataP);
  }

  public async buildViewData(queryParamsVD: QueryParamsVD): Promise<VipLevelListViewData>{
    let viewDataTmp: VipLevelListViewData = new VipLevelListViewData();
    let queryVipLevelTypeForm:QueryVipLevelTypeForm = new QueryVipLevelTypeForm();
    let queryVipLevelTypePageResp:PageResp = await this.vipLevelTypeMgr.getAllList(queryVipLevelTypeForm);
    viewDataTmp.vipLevelTypeList = queryVipLevelTypePageResp.list;
    viewDataTmp.queryParamsVD = queryParamsVD;
    let queryForm:QueryVipLevelForm = new QueryVipLevelForm();
    queryForm.typeId = queryParamsVD.typeId;
    queryForm.state = queryParamsVD.state;
    queryForm.name = queryParamsVD.name;
    queryForm.pageItemCount = 10;
    queryForm.pageNo = queryParamsVD.curPage;

    let pageResp:PageResp = await this.vipLevelMgr.getPage(queryForm);
    if(pageResp.list.length>0) {
      pageResp.list.forEach((item) => {
        let target = VipLevelVD.fromVipLevel(item, viewDataTmp.vipLevelTypeList);
        viewDataTmp.showList.push(target);
      });
    }
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.loadingFinish = true;

    return new Promise<VipLevelListViewData>(resolve => {
      resolve(viewDataTmp);
    });

  }

  public updateState(vipLevelId:number, state: number): Promise<boolean> {
    let updateStateData = new UpdateVipLevelStateForm();
    updateStateData.id = vipLevelId;
    updateStateData.state = state;
    return new Promise(resolve => {
      this.vipLevelMgr.updateVipLevelState(vipLevelId,updateStateData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

}

export class VipLevelListViewData {
  vipLevelList: Array<VipLevel> = new Array<VipLevel>();

  showList:Array<VipLevelVD> = new Array<VipLevelVD>();
  recordCount:number;//总记录数

  vipLevelTypeList: Array<VipLevelType> = new Array<VipLevelType>(); //等级分类列表
  loadingFinish:boolean = false;

  queryParamsVD:QueryParamsVD = new QueryParamsVD();

}

class QueryParamsVD{
  //查询参数
  curPage:number = Constants.DEFAULT_PAGENO;
  typeId:number = -1;
  state:number = -1;
  name:string = '';
}

class VipLevelVD{
  id:number;
  number:string;
  name:string;
  validPeriod:number;
  validPeriodUnit:number;
  openCharge:number;
  state:number;
  storeLimit:number;
  leaguerLimit:number;
  vipLevelType:VipLevelType;

  constructor(){}

  public static fromVipLevel(vipLevel:VipLevel,vipLevelTypeList: Array<VipLevelType>){
    let target = new VipLevelVD();
    target.id = vipLevel.id;
    target.number = vipLevel.number;
    target.name = vipLevel.name;
    target.validPeriod = vipLevel.validPeriod;
    target.validPeriodUnit = vipLevel.validPeriodUnit;
    target.openCharge = vipLevel.openCharge;
    target.state = vipLevel.state;

    vipLevelTypeList.forEach((value, index, array)=>{
      if(vipLevel.typeId == value.id){
        target.vipLevelType = value;
      }
    });

    if(vipLevel.vipContent){
      target.storeLimit = vipLevel.vipContent.storeLimit;
      target.leaguerLimit = vipLevel.vipContent.leaguerLimit;
    }
    return target;
  }
}
