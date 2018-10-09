import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {ProductDetail} from "./data/ProductDetail";
import {AppCfg} from "../../comModule/AppCfg";
import {ProductDetailQueryForm} from "./apiData/ProductDetailQueryForm";
import {PageResp} from "../../comModule/PageResp";
import {ReqMap} from "../../comModule/AppUtils";
import {IntfDetailMgr} from "../../comModule/dataDetail/IntfDetailMgr";


@Injectable()
export class ProductDetailMgr implements IntfDetailMgr{

  private productDetailDao:ProductDetailDao;

  constructor(private restProxy:AsyncRestProxy){
    this.productDetailDao = new ProductDetailDao(restProxy);
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
    let pageItemCount = 10;
    let reqMap = new ReqMap();
    reqMap.add("storeId", queryForm.storeId)
      .add("numberOrName", queryForm.numberOrName)
      .add("typeId", queryForm.typeId.toString())
      .add("state", queryForm.state.toString())
      .add("pageItemCount", pageItemCount.toString())
      .add("pageNo", queryForm.pageNo.toString());
    return this.productDetailDao.getPageRespByType(findPath, reqMap,ProductDetail);
  }

}

export class ProductDetailDao extends AsyncRestDao<ProductDetail>{
  constructor(restProxy:AsyncRestProxy){
    var table = "productDetail";
    super(ProductDetail,restProxy,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
