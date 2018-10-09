import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {StoreGoods} from "./data/StoreGoods";
import {AppCfg} from "../../comModule/AppCfg";
import {MgrPool} from "../../comModule/MgrPool";

@Injectable() //修饰器
export class StoreGoodsMgr{

  public static getInstance():StoreGoodsMgr{
    return MgrPool.getInstance().get("StoreGoodsMgr",StoreGoodsMgr);
  }

  private storeGoodsDao:StoreGoodsDao;

  constructor(){
    this.storeGoodsDao = new StoreGoodsDao();
  }

  public getStoreGoods(storeId:string):Promise<StoreGoods> {
    return this.storeGoodsDao.get(storeId);
  }

}


class StoreGoodsDao extends AsyncRestDao<StoreGoods>{
  constructor(){
    var table:string = "storeGoods";
    super(StoreGoods, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
