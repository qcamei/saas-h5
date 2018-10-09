import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ProductInfoListViewData} from "./ProductInfoListViewData";
import {PageResp} from "../../../../comModule/PageResp";
import {AppUtils} from "../../../../comModule/AppUtils";
import {ChainProductViewDataMgr} from "../../chainProductViewDataMgr";
import {Constants} from "../../../common/Util/Constants";
import {ChainProductMgr} from "../../../../bsModule/chainProduct/chainProductMgr";
import {ChainProductDetailMgr} from "../../../../bsModule/chainProduct/chainProductDetailMgr";
import {ProductDetailQueryForm} from "../../../../bsModule/chainProduct/apiData/ProductDetailQueryForm";
import {ChainProduct} from "../../../../bsModule/chainProduct/data/ChainProduct";
import {ChainProductSynDataHolder} from "../../../../bsModule/chainProduct/chainProductSynDataHolder";
import {UpdateProductStateData} from "../../../../bsModule/chainProduct/apiData/UpdateProductStateData";
import {BatchUpdateProductStateData} from "../../../../bsModule/chainProduct/apiData/BatchUpdateProductStateData";
import {RemoveProductInfoData} from "../../../../bsModule/chainProduct/apiData/RemoveProductInfoData";
import {ProductAllotForm} from "../../../../bsModule/chainProduct/apiData/ProductAllotForm";
import {ProductBatchAllotForm} from "../../../../bsModule/chainProduct/apiData/ProductBatchAllotForm";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {StoreVD} from "../../../chainPackageProject/packageProject/addPackage/addPackage";
export class ProductInfoListService {

  constructor(private chainProductMgr: ChainProductMgr,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainProductDetailMgr: ChainProductDetailMgr,
              private chainProductViewDataMgr: ChainProductViewDataMgr,
              private storeMgr:StoreMgr,) {
  }

  public initViewData() {
    this.chainProductViewDataMgr.setProductInfoListViewData(ProductInfoListViewData.getInstance());

    this.buildViewData().then(
      (viewDataTmp: ProductInfoListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }


  public handleViewData(viewDataP: ProductInfoListViewData) {
    this.chainProductViewDataMgr.setProductInfoListViewData(viewDataP);
  }


  /**
   * 组装productListViewData
   * @param chainId
   * @param status
   * @returns Promise<StorePrdInfoListViewData>
   */

  public async buildViewData(): Promise<ProductInfoListViewData>{

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: ProductInfoListViewData = ProductInfoListViewData.getInstance();
    let storePageResp = await this.storeMgr.findStoreByCond(chainId);
    if(storePageResp){
      viewDataTmp.storeList = storePageResp.list.map((store)=>{
        return StoreVD.fromStore(store);
      });
    }

    let chainProduct: ChainProduct = await this.chainProductSynDataHolder.getData(chainId);
    if (chainProduct) {
      viewDataTmp.productTypeMap = chainProduct.getAllProductTypeMap();
      viewDataTmp.productTypeList = viewDataTmp.productTypeMap.values();
    }


    let queryForm: ProductDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp: PageResp = await this.chainProductDetailMgr.getProductDetailPageInfo(queryForm);
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

    return new Promise<ProductInfoListViewData>(resolve => {
      resolve(viewDataTmp);
    });

  }

  public async getPageData() {

    let viewDataTmp: ProductInfoListViewData = ProductInfoListViewData.getInstance();
    viewDataTmp.loadingFinish = false;

    let queryForm: ProductDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp: PageResp = await this.chainProductDetailMgr.getProductDetailPageInfo(queryForm);
    viewDataTmp.productList = pageResp.list;

    viewDataTmp.productList.sort(function (item1, item2) {
      let a = item1.number;
      let b = item2.number;
      return a.localeCompare(b);
    });
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.loadingFinish = true;

    this.handleViewData(viewDataTmp);
  }

  private buildQueryForm(viewDataTmp: ProductInfoListViewData) {

    let chainId = SessionUtil.getInstance().getChainId();
    let queryForm: ProductDetailQueryForm = new ProductDetailQueryForm();
    queryForm.chainId = chainId;
    queryForm.numberOrName = viewDataTmp.queryForm.numberOrName;

    if(viewDataTmp.state != Constants.DEFAULT_STATE_VALUE){
      queryForm.stateArray.push(viewDataTmp.state);
    }
    viewDataTmp.queryForm.typeId == Constants.DEFAULT_TYPE_VALUE ? queryForm.typeId = "" : queryForm.typeId = viewDataTmp.queryForm.typeId;
    queryForm.pageItemCount = Constants.DEFAULT_PAGEITEMCOUNT;
    queryForm.pageNo = viewDataTmp.curPage;
    return queryForm;
  }

  /**
   * 修改项目状态
   * @param chainId:string
   * @param proId:number
   * @param state:number
   * @returns Promise<boolean>
   */

  public updateProductState(productId: string, state: number): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let updateProductStateData = new UpdateProductStateData();
    updateProductStateData.id = productId;
    updateProductStateData.state = state;
    return new Promise(resolve => {
      this.chainProductMgr.updateProductState(chainId,updateProductStateData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  /**
   * 批量修改项目状态
   * @param chainId:string
   * @param proIdSet:Array<number>
   * @param state:number
   * @returns Promise<boolean>
   */
  public batchUpdateProductState(prdIdSet: Array<string>, state: number): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let batchUpdatePrdStateData = new BatchUpdateProductStateData();
    batchUpdatePrdStateData.prdIdSet = prdIdSet;
    batchUpdatePrdStateData.state = state;
    return new Promise(resolve => {
      this.chainProductMgr.batchUpdateProductState(chainId,batchUpdatePrdStateData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  public allotStore(goodsId:string, applyStoreIds:Array<string>): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let allotForm = new ProductAllotForm();
    allotForm.id = goodsId;
    allotForm.applyStoreIds = applyStoreIds;
    return new Promise(resolve => {
      this.chainProductMgr.allotStore(chainId,allotForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public batchAllotStore(ids:Array<string>, applyStoreIds:Array<string>): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let batchAllotForm = new ProductBatchAllotForm();
    batchAllotForm.ids = ids;
    batchAllotForm.applyStoreIds = applyStoreIds;
    return new Promise(resolve => {
      this.chainProductMgr.batchAllotStore(chainId,batchAllotForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public deleteProduct(deleteForm: RemoveProductInfoData): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    return new Promise(resolve => {
      this.chainProductMgr.deleteProduct(chainId,deleteForm).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };


}
