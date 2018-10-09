
import {ChainCardMgr} from "../../../../bsModule/chainCard/chainCardMgr";
import {ChainCardSynDataHolder} from "../../../../bsModule/chainCard/chainCardSynDataHolder";
import {ChainCardViewDataMgr} from "../../ChainCardViewDataMgr";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {BusinessUtil} from "../../../common/Util/BusinessUtil";
import {PrdCardType} from "../../../../bsModule/chainCard/data/PrdCardType";
import {PrdCardTypeRemoveForm} from "../../../../bsModule/chainCard/apiData/PrdCardTypeRemoveForm";

export class ProductCardTypeListService {

  constructor(private chainCardMgr: ChainCardMgr,
              private chainCardSynDataHolder: ChainCardSynDataHolder,
              private chainCardViewDataMgr: ChainCardViewDataMgr,) {
  }

  public initViewData() {
    this.chainCardViewDataMgr.setProductCardTypeListViewData(new ProductCardTypeListViewData());

    this.buildViewData().then(
      (viewDataTmp: ProductCardTypeListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: ProductCardTypeListViewData) {
    this.chainCardViewDataMgr.setProductCardTypeListViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param chainId:string
   * @returns Promise<ProductCardTypeListViewData>
   */
  public  buildViewData(): Promise<ProductCardTypeListViewData> {
    return new Promise<ProductCardTypeListViewData>(resolve => {
      let chainId = SessionUtil.getInstance().getChainId();
      let productCardCardTypeListTmp: Array<PrdCardType> = new Array<PrdCardType>();
      let viewDataTmp: ProductCardTypeListViewData = new ProductCardTypeListViewData();
      this.chainCardMgr.getChainCard(chainId).then(
        (chainCard) => {
          productCardCardTypeListTmp = chainCard.getValidProductCardTypeMap().values();
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
   * @param chainId:string
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
    let chainId = SessionUtil.getInstance().getChainId();
    return new Promise<boolean>(resolve => {
      this.chainCardMgr.removeProductCardType(chainId,removeData).then(
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
