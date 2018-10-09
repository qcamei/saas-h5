import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {StoreProductInfo} from "./data/StoreProductInfo";
import {AppCfg} from "../../comModule/AppCfg";
import {MgrPool} from "../../comModule/MgrPool";


@Injectable() //修饰器
export class StoreProductInfoMgr{

  public static getInstance():StoreProductInfoMgr{
    return MgrPool.getInstance().get("StoreProductInfoMgr",StoreProductInfoMgr);
  }

  private storePrdDao:StorePrdDao;
  constructor(){
    this.storePrdDao = new StorePrdDao();
  }

  public get(storeId:string):Promise<StoreProductInfo> {
    return this.storePrdDao.get(storeId);
  }


}

class StorePrdDao extends AsyncRestDao<StoreProductInfo>{
  constructor(){
    var table:string = "storeProductInfo";
    super(StoreProductInfo, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
