

import {StoreCardInfoMgr} from "../../../../bsModule/storeCardInfo/StoreCardInfoMgr";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StoreCardInfoViewDataMgr} from "../../StoreCardInfoViewDataMgr";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {BusinessUtil} from "../../../common/Util/BusinessUtil";
import {PrdCardType} from "../../../../bsModule/storeCardInfo/data/PrdCardType";
import {PrdCardTypeRemoveForm} from "../../../../bsModule/storeCardInfo/apiData/PrdCardTypeRemoveForm";

export class ProductCardTypeListService {

  constructor(private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,) {
  }

  public initViewData() {
    this.storeCardInfoViewDataMgr.setProductCardTypeListViewData(new ProductCardTypeListViewData());

    this.buildViewData().then(
      (viewDataTmp: ProductCardTypeListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: ProductCardTypeListViewData) {
    this.storeCardInfoViewDataMgr.setProductCardTypeListViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param storeId:string
   * @returns Promise<ProductCardTypeListViewData>
   */
  public  buildViewData(): Promise<ProductCardTypeListViewData> {
    return new Promise<ProductCardTypeListViewData>(resolve => {
      let storeId = SessionUtil.getInstance().getStoreId();
      let productCardCardTypeListTmp: Array<PrdCardType> = new Array<PrdCardType>();
      let viewDataTmp: ProductCardTypeListViewData = new ProductCardTypeListViewData();
      this.storeCardInfoSynDataHolder.getData(storeId).then(
        (storeCardInfo) => {
          productCardCardTypeListTmp = storeCardInfo.getValidProductCardTypeMap().values();
          viewDataTmp.productCardTypeList = productCardCardTypeListTmp;//原始数据

          productCardCardTypeListTmp = BusinessUtil.sortListObject(productCardCardTypeListTmp);//排序
          viewDataTmp.productCardTypeListTmp = productCardCardTypeListTmp;
          viewDataTmp.recordCount = productCardCardTypeListTmp.length;
          viewDataTmp.productCardTypeListShow = AppUtils.getPageData(1, productCardCardTypeListTmp);
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
   * @param handleCallBack:(productCardCardTypeListTmp:Array<ProductCardCardType>)
   **/

  public queryTypeListReq(viewData, name: string, handleCallBack: (viewDataTmp: ProductCardTypeListViewData) => void) {
    let productCardTypeListTmp: Array<PrdCardType> = viewData.productCardTypeList;
    let viewDataTmp: ProductCardTypeListViewData = new ProductCardTypeListViewData();

    productCardTypeListTmp = this.filterListByName(name, productCardTypeListTmp);
    productCardTypeListTmp = BusinessUtil.sortListObject(productCardTypeListTmp);//排序

    viewDataTmp.productCardTypeListTmp = productCardTypeListTmp;
    viewDataTmp.recordCount = productCardTypeListTmp.length;
    viewDataTmp.productCardTypeListShow = AppUtils.getPageData(1, productCardTypeListTmp);
    handleCallBack(viewDataTmp);
  }

  /**根据名称过滤分类列表*/
  private filterListByName(name, productCardTypeListTmp:Array<PrdCardType>) {
    productCardTypeListTmp = productCardTypeListTmp.filter(itemTmp => {
      if (itemTmp.name == name || (itemTmp.name && itemTmp.name.indexOf(name) > -1)) {
        return true;
      } else {
        return false;
      }
    });
    return productCardTypeListTmp;
  }

  /**
   * 删除次卡分类
   */
  public deleteType(removeData:PrdCardTypeRemoveForm) {
    let storeId = SessionUtil.getInstance().getStoreId();
    return new Promise<boolean>(resolve => {
      this.storeCardInfoMgr.removeProductCardType(storeId,removeData).then(
        (success) => {
          resolve(success);
        });

    });
  }

}


export class ProductCardTypeListViewData {
  public productCardTypeList: Array<PrdCardType> = new Array<PrdCardType>();//原始数据
  public productCardTypeListTmp: Array<PrdCardType> = new Array<PrdCardType>();//临时数据
  public recordCount: number;//分页记录数
  public loadingFinish: boolean = false;

  public productCardTypeListShow: Array<PrdCardType> = new Array<PrdCardType>();//显示数据

  public typeName: string = "";//查询输入框的值

  public curPage = 1;

}
