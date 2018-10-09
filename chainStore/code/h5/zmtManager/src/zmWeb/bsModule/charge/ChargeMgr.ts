import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {Charge} from "./data/Charge";
import {ReqMap} from "../../comModule/AppUtils";
import {ChargeQueryForm} from "./apiData/ChargeQueryForm";
import {PageResp} from "../../comModule/PageResp";
import {ChargeAddForm} from "./apiData/ChargeAddForm";
import {ChargeUpdateApiForm} from "./apiData/ChargeUpdateApiForm";
import {ChargeUpdateInfoForm} from "./apiData/ChargeUpdateInfoForm";
import {ChargeUpdateType} from "./apiData/ChargeUpdateType";

@Injectable()
export class ChargeMgr{

  private chargeDao:ChargeDao;

  constructor(private restProxy:AsyncRestProxy){
    this.chargeDao = new ChargeDao(restProxy);
  }

  public get(id:string):Promise<Charge>{
    return this.chargeDao.get(id);
  }

  /**
   * 查询收费列表分页
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  public findChargePageInfo(queryForm:ChargeQueryForm):Promise<PageResp>{
    debugger
    let uriPath = "findChargePageInfo";
    let reqMap = new ReqMap();
    reqMap.add("phone",queryForm.phone)
      .add("chargeChannel",queryForm.chargeChannel.toString())
      .add("minCreateTime",queryForm.minCreateTime)
      .add("maxCreateTime",queryForm.maxCreateTime);
    return this.chargeDao.getPageRespByType(uriPath,reqMap,Charge);
  }

  /**
   * 添加收费
   * @param addForm
   * @returns {Promise<Charge>}
   */
  public addCharge(addForm:ChargeAddForm):Promise<Charge>{
    return this.chargeDao.addForm(addForm);
  }

  /**
   * 修改收费信息
   * @param id
   * @param chargeUpdateInfoForm
   * @returns {Promise<boolean>}
   */
  public updateChargeInfo(id:string,chargeUpdateInfoForm:ChargeUpdateInfoForm):Promise<boolean>{
    let chargeUpdateApiForm = new ChargeUpdateApiForm();
    chargeUpdateApiForm.updateType = ChargeUpdateType.UpdateInfo;
    chargeUpdateApiForm.chargeUpdateInfoForm = chargeUpdateInfoForm;
    return this.chargeDao.updateWithId(id,chargeUpdateApiForm);
  }

}

export class ChargeDao extends AsyncRestDao<Charge>{

  constructor(restProxy:AsyncRestProxy){
    let table = "charge";
    super(Charge,restProxy,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
