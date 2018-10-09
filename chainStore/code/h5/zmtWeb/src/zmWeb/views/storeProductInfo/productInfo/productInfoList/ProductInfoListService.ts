import {RemoveProductInfoData} from "../../../../bsModule/StoreProductInfo/apiData/RemoveProductInfoData";
import {BatchUpdateProductStateData} from "../../../../bsModule/StoreProductInfo/apiData/BatchUpdateProductStateData";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {UpdateProductStateData} from "../../../../bsModule/StoreProductInfo/apiData/UpdateProductStateData";
import {ProductDetailQueryForm} from "../../../../bsModule/productDetail/apiData/ProductDetailQueryForm";
import {ProductInfoListViewData} from "./ProductInfoListViewData";
import {PageResp} from "../../../../comModule/PageResp";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {AppUtils} from "../../../../comModule/AppUtils";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreProductInfoViewDataMgr} from "../../storeProductViewDataMgr";
import {ProductDetailMgr} from "../../../../bsModule/productDetail/ProductDetailMgr";
import {StoreProductInfoMgr} from "../../../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {Constants} from "../../../common/Util/Constants";
import {AddProductToTopData} from "../../../../bsModule/StoreProductInfo/apiData/AddProductToTopData";
import {CancelProductFromTopData} from "../../../../bsModule/StoreProductInfo/apiData/CancelProductFromTopData";

export class ProductInfoListService {

  constructor(private storeProductInfoMgr: StoreProductInfoMgr,
              private productDetailMgr: ProductDetailMgr,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeProductInfoViewDataMgr: StoreProductInfoViewDataMgr,) {
  }

  public initViewData() {

    this.storeProductInfoViewDataMgr.setProductInfoListViewData(ProductInfoListViewData.getInstance());

    this.buildViewData().then(
      (viewDataTmp: ProductInfoListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }


  public handleViewData(viewDataP: ProductInfoListViewData) {
    this.storeProductInfoViewDataMgr.setProductInfoListViewData(viewDataP);
  }


  /**
   * 组装productListViewData
   * @param storeId
   * @param status
   * @returns Promise<StorePrdInfoListViewData>
   */

  public async buildViewData():Promise<ProductInfoListViewData>{

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp = ProductInfoListViewData.getInstance();
    viewDataTmp.loadingFinish = false;

    let storeProductInfo: StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    if (storeProductInfo) {
      viewDataTmp.productTypeMap = storeProductInfo.getAllProductTypeMap();
      viewDataTmp.productTypeList = storeProductInfo.getValidProductTypeList();
    }
    let queryForm: ProductDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp: PageResp = await this.productDetailMgr.getProductDetailPageInfo(queryForm);

    if(pageResp && pageResp.list){
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

  private buildQueryForm(viewDataTmp: ProductInfoListViewData) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let queryForm: ProductDetailQueryForm = new ProductDetailQueryForm();
    queryForm.storeId = storeId;
    queryForm.numberOrName = viewDataTmp.queryForm.numberOrName;
    viewDataTmp.queryForm.state == Constants.DEFAULT_STATE_VALUE ? queryForm.state = Constants.DEFAULT_STATE_VALUE : queryForm.state = viewDataTmp.queryForm.state;
    viewDataTmp.queryForm.typeId == Constants.DEFAULT_TYPE_VALUE ? queryForm.typeId = Constants.NULL_STRING : queryForm.typeId = viewDataTmp.queryForm.typeId;
    queryForm.pageItemCount = Constants.DEFAULT_PAGEITEMCOUNT;
    queryForm.pageNo = viewDataTmp.curPage;
    return queryForm;
  }

  /**
   * 修改项目状态
   * @param storeId:string
   * @param proId:number
   * @param state:number
   * @returns Promise<boolean>
   */

  public updateProductState(productId: string, state: number): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let updateProductStateData = new UpdateProductStateData();
    updateProductStateData.id = productId;
    updateProductStateData.storeId = storeId;
    updateProductStateData.state = state;
    return new Promise(resolve => {
      this.storeProductInfoMgr.updateProductInfoState(updateProductStateData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  /**
   * 批量修改项目状态
   * @param storeId:string
   * @param proIdSet:Array<number>
   * @param state:number
   * @returns Promise<boolean>
   */
  public batchUpdateProductState(proIdSet: Array<string>, state: number): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let batchUpdatePrdStateData = new BatchUpdateProductStateData();
    batchUpdatePrdStateData.prdIdSet = proIdSet;
    batchUpdatePrdStateData.storeId = storeId;
    batchUpdatePrdStateData.state = state;
    return new Promise(resolve => {
      this.storeProductInfoMgr.batchUpdateProductInfoState(batchUpdatePrdStateData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  public deleteProduct(deleteForm: RemoveProductInfoData): Promise<boolean> {
    return new Promise(resolve => {
      this.storeProductInfoMgr.deleteProduct(deleteForm).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };


  public updateProductToTop(productId: string): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let toTopData = new AddProductToTopData();
    toTopData.productId = productId;
    toTopData.storeId = storeId;
    return new Promise(resolve => {
      this.storeProductInfoMgr.toTop(toTopData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  public updateProductCancelTop(productId: string): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let cancelTopData = new CancelProductFromTopData();
    cancelTopData.productId = productId;
    cancelTopData.storeId = storeId;
    return new Promise(resolve => {
      this.storeProductInfoMgr.cancelTop(cancelTopData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

}
