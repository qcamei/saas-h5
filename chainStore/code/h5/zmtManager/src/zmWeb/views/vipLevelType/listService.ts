import {VipLevelTypeViewDataMgr} from "./vipLevelTypeViewDataMgr";
import {AppUtils} from "../../comModule/AppUtils";
import {VipLevelTypeMgr} from "../../bsModule/vipLevelType/VipLevelTypeMgr";
import {VipLevelType} from "../../bsModule/vipLevelType/data/VipLevelType";
import {PageResp} from "../../comModule/PageResp";
import {QueryVipLevelTypeForm} from "../../bsModule/vipLevelType/apiData/QueryVipLevelTypeForm";

export class VipLevelTypeListService {

  constructor(private vipLevelTypeMgr: VipLevelTypeMgr,
              private vipLevelTypeViewDataMgr: VipLevelTypeViewDataMgr,) {
  }

  public initViewData() {
    this.vipLevelTypeViewDataMgr.setVipLevelTypeListViewData(new VipLevelTypeListViewData());

    this.buildViewData().then(
      (viewDataTmp: VipLevelTypeListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: VipLevelTypeListViewData) {
    this.vipLevelTypeViewDataMgr.setVipLevelTypeListViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param chainId:string
   * @returns Promise<VipLevelTypeListViewData>
   */
  public async buildViewData(): Promise<VipLevelTypeListViewData> {
    let viewDataTmp: VipLevelTypeListViewData = new VipLevelTypeListViewData();

    let queryForm: QueryVipLevelTypeForm = new QueryVipLevelTypeForm();
    queryForm.pageNo = viewDataTmp.curPage;
    queryForm.pageItemCount = 10;
    let pageResp: PageResp = await this.vipLevelTypeMgr.getPage(queryForm);

    viewDataTmp.typeList = pageResp.list;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.loadingFinish = true;
    return new Promise<VipLevelTypeListViewData>(resolve => {
      resolve(viewDataTmp);
    });
  };

  public async getPageData(curPage, viewData: VipLevelTypeListViewData) {
    let viewDataTmp: VipLevelTypeListViewData = new VipLevelTypeListViewData();
    viewDataTmp.name = viewData.name;

    let queryForm: QueryVipLevelTypeForm = new QueryVipLevelTypeForm();
    queryForm.pageNo = curPage;
    queryForm.pageItemCount = 10;
    queryForm.name = viewDataTmp.name;
    let pageResp: PageResp = await this.vipLevelTypeMgr.getPage(queryForm);

    viewDataTmp.typeList = pageResp.list;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.loadingFinish = true;

    this.handleViewData(viewDataTmp);
  }

}


export class VipLevelTypeListViewData {
  public typeList: Array<VipLevelType> = new Array<VipLevelType>();

  public curPage = 1;
  public recordCount: number;//分页记录数
  public loadingFinish: boolean = false;

  public name: string = "";//查询输入框的值

}
