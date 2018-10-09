import {BeauticianInfo} from "./BeauticianInfo";
import {ZmMap} from "../../../comModule/AppUtils";


export class StoreBeauticianInfo {
  id:string;
  storeId:string;
  beauticianInfoMap:Array<BeauticianInfo>;
  createdTime:string;
  lastUpdateTime:string;
  ver:number;
  constructor(){}

  public getBeauticianMap():ZmMap<BeauticianInfo>{
    let beauticianMap = new ZmMap<BeauticianInfo>();
    for (let index in this.beauticianInfoMap) {
      let item = this.beauticianInfoMap[index];
      beauticianMap.put(item.buserId, item);
    }
    return beauticianMap;
  }
}
