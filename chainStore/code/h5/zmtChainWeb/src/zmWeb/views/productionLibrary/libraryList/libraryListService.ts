import {SellProductMgr} from "../../../bsModule/sellProduct/sellProductMgr";
import {ProductLibraryViewDataMgr} from "../productLibraryViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SellProductQueryForm} from "../../../bsModule/sellProduct/apiData/SellProductQueryForm";
import {PageResp} from "../../../comModule/PageResp";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Constants} from "../../common/Util/Constants";
import {SellProductUpdateStateForm} from "../../../bsModule/sellProduct/apiData/SellProductUpdateStateForm";
import {SellProductBatchUpdateStateForm} from "../../../bsModule/sellProduct/apiData/SellProductBatchUpdateStateForm";
import {SellProductAllotForm} from "../../../bsModule/sellProduct/apiData/SellProductAllotForm";
import {SellProductBatchAllotForm} from "../../../bsModule/sellProduct/apiData/SellProductBatchAllotForm";
import {Store} from "../../../bsModule/store/data/Store";
import {StoreMgr} from "../../../bsModule/store/storeMgr";
import {LibraryListViewData} from "./libraryListViewData";
import {SellAllotId} from "../../../bsModule/sellProduct/apiData/SellAllotId";

export class LibraryListService {
  constructor(private sellProductMgr: SellProductMgr,
              private productLibraryViewDataMgr: ProductLibraryViewDataMgr,
              private storeMgr:StoreMgr,) {
  }

  public initViewData(curPage) {
    this.productLibraryViewDataMgr.setLibraryListViewData(new LibraryListViewData());

    this.buildViewData(curPage).then(
      (viewDataTmp: LibraryListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }


  public handleViewData(viewDataP: LibraryListViewData) {
    this.productLibraryViewDataMgr.setLibraryListViewData(viewDataP);
  }


  public async buildViewData(curPage): Promise<LibraryListViewData> {

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: LibraryListViewData = new LibraryListViewData();

    let storePageResp :PageResp = await this.storeMgr.findStoreByCond(chainId);
    if(storePageResp){
      viewDataTmp.storeList = storePageResp.list;
    }

    let queryForm: SellProductQueryForm = this.buildQueryForm(viewDataTmp,curPage);
    let pageResp: PageResp = await this.sellProductMgr.getPageInfo(queryForm);
    if(pageResp){
      viewDataTmp.productList = pageResp.list;
      viewDataTmp.productList.sort(function (item1, item2) {
        let a = item1.number;
        let b = item2.number;
        return a.localeCompare(b);
      });
      viewDataTmp.recordCount = pageResp.totalCount;
    }
    viewDataTmp.loadingFinish = true;

    return new Promise<LibraryListViewData>(resolve => {
      resolve(viewDataTmp);
    });

  }

  public async getPageData(curPage, viewData: LibraryListViewData) {

    let viewDataTmp: LibraryListViewData = new LibraryListViewData();
    viewDataTmp.queryForm = viewData.queryForm;
    viewDataTmp.state = viewData.state;
    viewDataTmp.sellProductType = viewData.sellProductType;
    viewDataTmp.loadingFinish = false;
    viewDataTmp.storeList = viewData.storeList;

    let queryForm: SellProductQueryForm = this.buildQueryForm(viewDataTmp,curPage);
    let pageResp: PageResp = await this.sellProductMgr.getPageInfo(queryForm);
    if(pageResp){
      viewDataTmp.productList = pageResp.list;
      viewDataTmp.productList.sort(function (item1, item2) {
        let a = item1.number;
        let b = item2.number;
        return a.localeCompare(b);
      });
      viewDataTmp.recordCount = pageResp.totalCount;
    }
    viewDataTmp.loadingFinish = true;

    this.handleViewData(viewDataTmp);
  }

  private buildQueryForm(viewDataTmp: LibraryListViewData, curPage) {
    let chainId = SessionUtil.getInstance().getChainId();
    let queryForm: SellProductQueryForm = new SellProductQueryForm();
    queryForm.chainId = chainId;
    queryForm.numberOrName = viewDataTmp.queryForm.numberOrName;

    if(viewDataTmp.state != Constants.DEFAULT_STATE_VALUE){
      queryForm.stateArray.push(viewDataTmp.state);
    }
    if(viewDataTmp.sellProductType != -1){
      queryForm.sellProductTypeArray.push(viewDataTmp.sellProductType);
    }
    viewDataTmp.queryForm.typeId == Constants.DEFAULT_TYPE_VALUE ? queryForm.typeId = "" : queryForm.typeId = viewDataTmp.queryForm.typeId;
    queryForm.pageItemCount = Constants.DEFAULT_PAGEITEMCOUNT;
    queryForm.pageNo = curPage;
    return queryForm;
  }

  public updateSellProductState(sellAllotId: SellAllotId, state: number): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let updateStateForm = new SellProductUpdateStateForm();
    updateStateForm.sellAllotId = sellAllotId;
    updateStateForm.state = state;
    return new Promise(resolve => {
      this.sellProductMgr.updateSellProductState(chainId,updateStateForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public batchUpdateSellProductState(sellProductUpdateStateForms: Array<SellProductUpdateStateForm>): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let batchUpdateStateForm = new SellProductBatchUpdateStateForm();
    batchUpdateStateForm.sellProductUpdateStateForms = sellProductUpdateStateForms;
    return new Promise(resolve => {
      this.sellProductMgr.batchUpdateSellProductState(chainId,batchUpdateStateForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public allotSellProduct(sellAllotId:SellAllotId,applyStoreIds): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let allotForm = new SellProductAllotForm();
    allotForm.sellAllotId = sellAllotId;
    allotForm.applyStoreIds = applyStoreIds;
    return new Promise(resolve => {
      this.sellProductMgr.allotSellProduct(chainId,allotForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public batchAllotSellProduct(productAllotForms: Array<SellProductAllotForm>): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let batchAllotForm = new SellProductBatchAllotForm();
    batchAllotForm.productAllotForms = productAllotForms;
    return new Promise(resolve => {
      this.sellProductMgr.batchAllotSellProduct(chainId,batchAllotForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

}

