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

}
