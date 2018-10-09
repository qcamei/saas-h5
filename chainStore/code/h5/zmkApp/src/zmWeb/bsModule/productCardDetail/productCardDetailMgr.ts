import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {ProductCardDetail} from "./data/ProductCardDetail";
import {MgrPool} from "../../comModule/MgrPool";
import {AppUtils} from "../../comModule/AppUtils";


@Injectable()
export class ProductCardDetailMgr{

  public static getInstance():ProductCardDetailMgr{
    return MgrPool.getInstance().get("ProductCardDetailMgr",ProductCardDetailMgr);
  }

  private productCardDetailDao:ProductCardDetailDao;
  constructor(){
    this.productCardDetailDao = new ProductCardDetailDao();
  }

  public get(storeId:string,productCardId:string):Promise<ProductCardDetail>{
    let uriPattern = "{0}/{1}/";
    let uri = AppUtils.format(uriPattern,storeId,productCardId);
    return this.productCardDetailDao.getByUri(uri);
  }

}

export class ProductCardDetailDao extends AsyncRestDao<ProductCardDetail>{
  constructor(){
    var table = "productCardDetail";
    super(ProductCardDetail,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
