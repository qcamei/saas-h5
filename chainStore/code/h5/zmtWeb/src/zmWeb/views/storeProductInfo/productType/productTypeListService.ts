import {RemoveProductTypeData} from "../../../bsModule/StoreProductInfo/apiData/RemoveProductTypeData";
import {StoreProductInfoMgr} from "../../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreProductInfoViewDataMgr} from "../storeProductViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {BusinessUtil} from "../../common/Util/BusinessUtil";

export class ProductTypeListService {

  constructor(private storeProductInfoMgr: StoreProductInfoMgr,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeProductInfoViewDataMgr: StoreProductInfoViewDataMgr,) {
  }

  public initViewData() {
    this.storeProductInfoViewDataMgr.setProductTypeListViewData(new ProductTypeListViewData());

    this.buildViewData().then(
      (viewDataTmp: ProductTypeListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: ProductTypeListViewData) {
    this.storeProductInfoViewDataMgr.setProductTypeListViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param storeId:string
   * @returns Promise<ProductTypeListViewData>
   */
  public  buildViewData(): Promise<ProductTypeListViewData> {
    return new Promise<ProductTypeListViewData>(resolve => {
      let storeId = SessionUtil.getInstance().getStoreId();
      let prdTypeListTmp: Array<ProductType> = new Array<ProductType>();
      let viewDataTmp: ProductTypeListViewData = new ProductTypeListViewData();
      this.storeProductInfoSynDataHolder.getData(storeId).then(
        (storePrd) => {
          prdTypeListTmp = storePrd.getValidProductTypeList();
          viewDataTmp.prdTypeList = prdTypeListTmp;//原始数据

          prdTypeListTmp = BusinessUtil.sortListObject(prdTypeListTmp);//排序
          viewDataTmp.prdTypeListTmp = prdTypeListTmp;
          viewDataTmp.recordCount = prdTypeListTmp.length;
          viewDataTmp.prdTypeListShow = AppUtils.getPageData(1, prdTypeListTmp);
          viewDataTmp.loadingFinish = true;
          resolve(viewDataTmp);
        }
      );
    });
  };

  /**
   * 根据名称查询分类列表
   * @param storeId:string
   * @param name:string
   * @param handleCallBack:(prdTypeListTmp:Array<PrdType>)
   **/

  public queryTypeListReq(viewData, name: string, handleCallBack: (viewDataTmp: ProductTypeListViewData) => void) {
    let prdTypeListTmp: Array<ProductType> = viewData.prdTypeList;
    let viewDataTmp: ProductTypeListViewData = new ProductTypeListViewData();
    prdTypeListTmp = this.filterListByName(name, prdTypeListTmp);
    prdTypeListTmp = BusinessUtil.sortListObject(prdTypeListTmp);//排序

    viewDataTmp.prdTypeListTmp = prdTypeListTmp;
    viewDataTmp.recordCount = prdTypeListTmp.length;
    viewDataTmp.prdTypeListShow = AppUtils.getPageData(1, prdTypeListTmp);
    handleCallBack(viewDataTmp);
  }

  /**根据名称过滤分类列表*/
  private filterListByName(name, prdTypeListTmp) {
    prdTypeListTmp = prdTypeListTmp.filter(itemTmp => {
      if (itemTmp.name == name || (itemTmp.name && itemTmp.name.indexOf(name) > -1)) {
        return true;
      } else {
        return false;
      }
    });
    return prdTypeListTmp;
  }

  /**
   * 删除项目分类
   */
  public deleteType(removeData: RemoveProductTypeData) {
    return new Promise<boolean>(resolve => {
      this.storeProductInfoMgr.deleteProductType(removeData).then(
        (success) => {
          resolve(success);
        });

    });
  }

}


export class ProductTypeListViewData {
  public prdTypeList: Array<ProductType> = new Array<ProductType>();//原始数据
  public prdTypeListTmp: Array<ProductType> = new Array<ProductType>();//临时数据
  public recordCount: number;//分页记录数
  public loadingFinish: boolean = false;

  public prdTypeListShow: Array<ProductType> = new Array<ProductType>();//显示数据

  public typeName: string = "";//查询输入框的值

  public curPage = 1;

}
