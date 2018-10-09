import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {BUser} from "./data/BUser";
import {BUserChainQueryForm} from "./apiData/BUserChainQueryForm";
import {PageResp} from "../../comModule/PageResp";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {ReqMap} from "../../comModule/AppUtils";
import {BUserAddByChainForm} from "./apiData/BUserAddByChainForm";

@Injectable()
export class BUserMgr {

  private buserDao: BUserDao;

  constructor(restProxy: AsyncRestProxy) {
    this.buserDao = new BUserDao(restProxy);
  }

  public getBUser(buserId: number): Promise<BUser> {
    return this.buserDao.get(buserId);
  }


  public findByChain(queryForm: BUserChainQueryForm): Promise<PageResp> {
    let path = "findByChain";
    let reqMap = new ReqMap();
    reqMap.add("chainId",queryForm.chainId)
    .add("pageNo",queryForm.pageNo.toString())
    .add("pageItemCount",queryForm.pageItemCount.toString());
    return this.buserDao.getPageRespByType(path,reqMap,BUser);
  }

  public regByChainForm(buserAddByChainForm:BUserAddByChainForm){
    return this.buserDao.addForm(buserAddByChainForm);
  }
}

class BUserDao extends AsyncRestDao<BUser> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "buser";
    super(BUser, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}

