import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {VipLevel} from "./data/VipLevel";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AppCfg} from "../../comModule/AppCfg";
import {StoreVipLevelQueryForm} from "./apiData/StoreVipLevelQueryForm";
import {ReqMap} from "../../comModule/AppUtils";
import {PageResp} from "../../comModule/PageResp";

@Injectable()
export class VipLevelMgr{

  private vipLevelDao:VipLevelDao;

  constructor(private restProxy:AsyncRestProxy){
    this.vipLevelDao = new VipLevelDao(this.restProxy);
  }

  public get(id:string):Promise<VipLevel>{
    return this.vipLevelDao.get(id);
  }

  /**
   * 查询vipLevel列表
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  public findPage(queryForm:StoreVipLevelQueryForm):Promise<PageResp>{
    let uriPath = "findPage";
    let reqMap = new ReqMap();
    reqMap.add("vipType",queryForm.vipType.toString());
    return this.vipLevelDao.getPageRespByType(uriPath,reqMap,VipLevel);
  }

}

export class VipLevelDao extends AsyncRestDao<VipLevel>{

  constructor(restProxy:AsyncRestProxy){
    let table:string = "vipLevel";
    super(VipLevel,restProxy,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
