import {OrderPayRemark} from "./OrderPayRemark";
import {ZmMap} from "../../../comModule/AppUtils";
import {ChargeBackRecord} from "./ChargeBackRecord";
import {RevokeContent} from "./RevokeContent";
export class OrderNotes {
    constructor(){}
    id:number;
    storeId:number;
    orderPayRemark:OrderPayRemark;
    chargeBackRecordIndex:number;
    chargeBackRecordMap:any;
    revokeContent:RevokeContent;//会员充值 撤单
    createTime:number;
    lastUpdateTime:number;
    ver:number;

  public getChargeBackRecordMap() {
    let targetMapTmp = this.chargeBackRecordMap;
    let targetMap = new ZmMap<ChargeBackRecord>();
    for (let index in targetMapTmp) {
      let target = targetMapTmp[index];
      targetMap.put(target.id,target);
    }
    return targetMap;
  }
}
