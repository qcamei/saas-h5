import {Injectable} from '@angular/core';
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {EUser} from "./apiData/EUser";
import {ReqMap} from "../../comModule/AppUtils";
import {EUserUpdateForm} from "./apiData/EUserUpdateForm";
import {EUserUpdateType} from "./apiData/EUserUpdateType";
import {EUserAddForm} from "./apiData/EUserAddForm";
import {EUserUpdateCountData} from "./apiData/EUserUpdateCountData";
import {AppCfg} from "../../comModule/AppCfg";


@Injectable()
export class EUserMgr {

  private euserDao: EUserDao;

  constructor(restProxy: AsyncRestProxy) {
    this.euserDao = new EUserDao(restProxy);
  }


  public addEUser(euserAddForm:EUserAddForm):Promise<EUser> {
    return this.euserDao.add(euserAddForm);
  }

  public getEUser(id: String): Promise<EUser> {
    return this.euserDao.get(id);
  }
  public getList(pageItemCount:number,pageNo:number): Promise<Array<EUser>> {
    let findPath="findList";
    return this.euserDao.findList(findPath,pageItemCount,pageNo);
  }



  public findByPhone(phone: string):Promise<EUser>{
    let uriPath = "findByPhone";
    let reqMap = new ReqMap().add("phone", phone);
    return this.euserDao.findOneWithReqParam(uriPath, reqMap);
  }

  public updateCount(euserId:number, euserUpdateCountData:EUserUpdateCountData):Promise<boolean> {
    var euserUpdateForm = new EUserUpdateForm();
    euserUpdateForm.updateType =  EUserUpdateType.updateCount;
    euserUpdateForm.updateCountData = euserUpdateCountData;
    return this.euserDao.updateWithId(euserId, euserUpdateForm);
  }


}

class EUserDao extends AsyncRestDao<EUser> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "euser";
    super(EUser, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}


