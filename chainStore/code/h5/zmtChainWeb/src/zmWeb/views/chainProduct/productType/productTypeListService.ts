import {ChainProductViewDataMgr} from "../chainProductViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BusinessUtil} from "../../common/Util/BusinessUtil";
import {ChainProductMgr} from "../../../bsModule/chainProduct/chainProductMgr";
import {ChainProductSynDataHolder} from "../../../bsModule/chainProduct/chainProductSynDataHolder";
import {ProductType} from "../../../bsModule/chainProduct/data/ProductType";
import {RemoveProductTypeData} from "../../../bsModule/chainProduct/apiData/RemoveProductTypeData";

export class ProductTypeListService {

  constructor(private chainProductMgr: ChainProductMgr,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainProductViewDataMgr: ChainProductViewDataMgr,) {
  }

  public initViewData() {
    this.chainProductViewDataMgr.setProductTypeListViewData(new ProductTypeListViewData());

    this.buildViewData().then(
      (viewDataTmp: ProductTypeListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: ProductTypeListViewData) {
    this.chainProductViewDataMgr.setProductTypeListViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param chainId:string
   * @returns Promise<ProductTypeListViewData>
   */
  public  buildViewData(): Promise<ProductTypeListViewData> {
    return new Promise<ProductTypeListViewData>(resolve => {
      let chainId = SessionUtil.getInstance().getChainId();
      let prdTypeListTmp: Array<ProductType> = new Array<ProductType>();
      let viewDataTmp: ProductTypeListViewData = new ProductTypeListViewData();
      this.chainProductSynDataHolder.getData(chainId).then(
      // this.chainProductMgr.getChainProduct(chainId).then(
        (storePrd) => {
          prdTypeListTmp = storePrd.getValidProductTypeMap().values();
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
   * @param chainId:string
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
    let chainId = SessionUtil.getInstance().getChainId();
    return new Promise<boolean>(resolve => {
      this.chainProductMgr.deleteProductType(chainId,removeData).then(
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
