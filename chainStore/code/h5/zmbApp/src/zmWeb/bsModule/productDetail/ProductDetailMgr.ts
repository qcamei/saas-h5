import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {ProductDetail} from "./data/ProductDetail";
import {AppCfg} from "../../comModule/AppCfg";
import {ProductDetailQueryForm} from "./apiData/ProductDetailQueryForm";
import {ReqMap} from "../../comModule/AppUtils";
import {IntfDetailMgr} from "../../comModule/dataDetail/IntfDetailMgr";
import {MgrPool} from "../../comModule/MgrPool";
import {PageResp} from "../../comModule/asynDao/apiData/PageResp";


@Injectable()
export class ProductDetailMgr implements IntfDetailMgr{

  public static getInstance():ProductDetailMgr{
    return MgrPool.getInstance().get("ProductDetailMgr",ProductDetailMgr);
  }

  private productDetailDao:ProductDetailDao;
  constructor(){
    this.productDetailDao = new ProductDetailDao();
  }

  /**
   * 通过项目id获取详情
   * @param ProductId
   * @returns {Promise<ProductDetail>}
   */
  public get(productDetailId:number):Promise<ProductDetail>{
    return this.productDetailDao.get(productDetailId);
  }

  public getProductDetailPageInfo(queryForm:ProductDetailQueryForm):Promise<PageResp>{
    let findPath = "getProductDetailPageInfo";
    let reqMap = new ReqMap();
    reqMap.add("storeId", queryForm.storeId)
      .add("numberOrName", queryForm.numberOrName)
      .add("typeId", queryForm.typeId.toString())
      .add("state", queryForm.state.toString())
      .add("pageItemCount", queryForm.pageItemCount.toString())
      .add("pageNo", queryForm.pageNo.toString());
    return this.productDetailDao.getPageRespByType(findPath, reqMap,ProductDetail);
  }

}

export class ProductDetailDao extends AsyncRestDao<ProductDetail>{
  constructor(){
    var table = "productDetail";
    super(ProductDetail,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
