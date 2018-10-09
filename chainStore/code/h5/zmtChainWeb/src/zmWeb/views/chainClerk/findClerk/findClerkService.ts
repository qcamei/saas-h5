import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ChainClerkReomveForm} from "../../../bsModule/chainClerk/apiData/ChainClerkReomveForm";
import {ChainBatchAllotStoreForm} from "../../../bsModule/chainClerk/apiData/ChainBatchAllotStoreForm";
import {ChainAllotStoreForm} from "../../../bsModule/chainClerk/apiData/ChainAllotStoreForm";
import {ChainClerkData, FindClerkViewData} from "./findClerkViewData";
import {ChainUserDto} from "../../../bsModule/chainUser/data/ChainUserDto";
import {Constants} from "../../common/Util/Constants";
import {ChainUserQueryForm} from "../../../bsModule/chainUser/apiData/ChainUserQueryForm";
import {PageResp} from "../../../comModule/PageResp";
import {ChainClerk} from "../../../bsModule/chainClerk/data/ChainClerk";
import {StoreMgr} from "../../../bsModule/store/storeMgr";
import {ChainClerkViewDataMgr} from "../ChainClerkViewDataMgr";
import {ChainClerkSynDataHolder} from "../../../bsModule/chainClerk/ChainClerkSynDataHolder";
import {ChainClerkMgr} from "../../../bsModule/chainClerk/ChainClerkMgr";
import {ChainUserMgr} from "../../../bsModule/chainUser/ChainUserMgr";

export class FindClerkService {
  constructor(private chainUserMgr: ChainUserMgr,
              private chainClerkMgr: ChainClerkMgr,
              private chainClerkSynDataHolder: ChainClerkSynDataHolder,
              private chainClerkViewDataMgr: ChainClerkViewDataMgr,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(): void {
    let viewDataTmp = new FindClerkViewData();
    this.chainClerkViewDataMgr.setFindClerkViewData(viewDataTmp);

    this.buildViewData((viewDataP: FindClerkViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP) {
    this.chainClerkViewDataMgr.setFindClerkViewData(viewDataP);
  }

  /**
   * 查询chainClerk 组装数据
   * @param callback
   */
  public async buildViewData(callback: (viewDataP: FindClerkViewData) => void) {
    let viewDataTmp = new FindClerkViewData();

    let chainId = SessionUtil.getInstance().getChainId();
    let storepageResp = await this.storeMgr.findStoreByCond(chainId);
    if (storepageResp) {
      viewDataTmp.storeList = storepageResp.list;
    }

    let chainClerk:ChainClerk = await this.chainClerkSynDataHolder.getData(chainId);
    if(chainClerk && chainClerk.roleMap){
      viewDataTmp.roleList = chainClerk.getEditRoleMap().values();
    }

    let queryForm:ChainUserQueryForm = this.buildQueryForm(viewDataTmp,1);
    let pageResp:PageResp = await this.chainUserMgr.findByCond(queryForm);
    viewDataTmp.chainClerkListShow = this.getClerkDataList(pageResp.list);
    viewDataTmp.chainRecordCount = pageResp.totalCount;

    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  public async getPageData(curPage, viewData: FindClerkViewData) {
    let viewDataTmp:FindClerkViewData = new FindClerkViewData();
    viewDataTmp.roleList = viewData.roleList;
    viewDataTmp.queryForm = viewData.queryForm;
    viewDataTmp.chainCurPage = curPage;
    viewDataTmp.isStoreClerk = viewData.isStoreClerk;
    viewDataTmp.loadingFinish = false;


    let chainId = SessionUtil.getInstance().getChainId();
    let storepageResp = await this.storeMgr.findStoreByCond(chainId);
    if (storepageResp) {
      viewDataTmp.storeList = storepageResp.list;
    }

    let queryForm:ChainUserQueryForm = this.buildQueryForm(viewDataTmp,curPage);
    let pageResp:PageResp = await this.chainUserMgr.findByCond(queryForm);
    viewDataTmp.chainClerkListShow = this.getClerkDataList(pageResp.list);
    viewDataTmp.chainRecordCount = pageResp.totalCount;

    viewDataTmp.loadingFinish = true;

    this.handleViewData(viewDataTmp);
  }

  private buildQueryForm(viewDataTmp: FindClerkViewData, curPage) {
    let chainId = SessionUtil.getInstance().getChainId();
    let queryForm: ChainUserQueryForm = new ChainUserQueryForm();
    queryForm.chainId = chainId;
    queryForm.phoneOrName = viewDataTmp.queryForm.phoneOrName;
    queryForm.pageItemCount = Constants.DEFAULT_PAGEITEMCOUNT;
    queryForm.pageNo = curPage;

    viewDataTmp.queryForm.roleId != "-1"?queryForm.roleId = viewDataTmp.queryForm.roleId:queryForm.roleId = "";

    let crossClerks = "";
    viewDataTmp.isStoreClerk != -1?crossClerks=viewDataTmp.isStoreClerk.toString():crossClerks="";
    queryForm.crossClerks.push(crossClerks);

    return queryForm;
  }

  private getClerkDataList(list:Array<ChainUserDto>): Array<ChainClerkData> {
    let clerkDataList = new Array<ChainClerkData>();
    for (let item of list) {
      let chainClerkData = ChainClerkData.fromChainUserDto(item);
      clerkDataList.push(chainClerkData);
    }
    return clerkDataList;
  }


  public allotStore(userId:number,storeIds:Array<string>): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let allotForm = new ChainAllotStoreForm();
    allotForm.userId = userId;
    allotForm.storeIds = storeIds;
    return new Promise(resolve => {
      this.chainClerkMgr.allotStore(chainId,allotForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public batchAllotStore(chainAllotStoreForms: Array<ChainAllotStoreForm>): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let batchAllotForm = new ChainBatchAllotStoreForm();
    batchAllotForm.chainAllotStoreForms = chainAllotStoreForms;
    return new Promise(resolve => {
      this.chainClerkMgr.batchAllotStore(chainId,batchAllotForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public deleteChainClerk(userId: number): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let chainClerkReomveForm: ChainClerkReomveForm = new ChainClerkReomveForm();
    chainClerkReomveForm.chainId = chainId;
    chainClerkReomveForm.userId = userId;
    return new Promise(resolve => {
      this.chainClerkMgr.removeClerk(chainId, chainClerkReomveForm).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };
}
