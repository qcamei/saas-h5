import {AppointTimeConfig} from "./appoint/AppointTimeConfig";
import {ZmMap} from "../../../comModule/AppUtils";
import {CancelAppointConfig} from "./appoint/CancelAppointConfig";
export class AppointConfig {
  appointTimeConfig:AppointTimeConfig;
  cancelAppointIndex:number;
  cancelAppointConfigMap:any;
  constructor(){}

  public getCancelAppointConfigMap():ZmMap<CancelAppointConfig>{
    let tmpMap = new ZmMap<CancelAppointConfig>();
    for (let index in this.cancelAppointConfigMap) {
      let item = this.cancelAppointConfigMap[index];
      tmpMap.put(item.id, item);
    }
    return tmpMap;
  }

  public getCancelAppointConfigList():Array<CancelAppointConfig>{
    let cfgList = new Array<CancelAppointConfig>();
    for (let index in this.cancelAppointConfigMap) {
      let item = this.cancelAppointConfigMap[index];
      let itemTmp = CancelAppointConfig.newInstance(item.id, item.reason);
      cfgList.push(itemTmp);
    }
    return cfgList;
  }

}
