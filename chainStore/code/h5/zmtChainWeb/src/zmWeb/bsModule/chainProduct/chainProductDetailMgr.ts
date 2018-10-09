


import {Injectable} from "@angular/core";
import {IntfDetailMgr} from "../../comModule/dataDetail/IntfDetailMgr";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {ProductDetail} from "./data/ProductDetail";
import {ProductDetailQueryForm} from "./apiData/ProductDetailQueryForm";
import {PageResp} from "../../comModule/PageResp";
import {ReqMap, AppUtils} from "../../comModule/AppUtils";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";

@Injectable()
export class ChainProductDetailMgr implements IntfDetailMgr{

  private productDetailDao:ProductDetailDao;

  constructor(private restProxy:AsyncRestProxy){
    this.productDetailDao = new ProductDetailDao(restProxy);
  }

  /**
   * 通过项目id获取详情
   * @param ProductId
   * @returns {Promise<ProductDetail>}
   */
  public get(chainId:string,productDetailId:number):Promise<ProductDetail>{
    let uriPattern = "{0}/{1}";
    let id = AppUtils.format(uriPattern,chainId,productDetailId);
    return this.productDetailDao.get(id);
  }

  public getProductDetailPageInfo(queryForm:ProductDetailQueryForm):Promise<PageResp>{
    let findPath = "getProductDetailPageInfo";
    let pageItemCount = 10;
    let reqMap = new ReqMap();
    let state = "";
    if(queryForm.stateArray){
      state = queryForm.stateArray.join(",");
    }
    reqMap.add("chainId", queryForm.chainId)
      .add("numberOrName", queryForm.numberOrName)
      .add("typeId", queryForm.typeId)
      .add("stateArray", state)
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
