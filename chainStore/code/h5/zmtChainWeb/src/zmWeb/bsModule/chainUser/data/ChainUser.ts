import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {ChainStoreUserRelative} from "./ChainStoreUserRelative";
export class ChainUser {
  constructor() {
  }

  id: number;
  name: string;
  namePass:boolean;

  areaCode: string;
  phone: string;
  phonePass:boolean;

  password: string;
  headImg: string;
  gender: number;
  birthday: string;
  salt: string;
  crossClerk: number;//CrossClerkEnum
  chainSUMap: any;//ZmMap<ChainStoreUserRelative>
  createdTime: number;
  lastUpdateTime: number;
  ver: number;

  public getChainSUMap() {
    let targetMapTmp = this.chainSUMap;
    let targetMap = new ZmMap<ChainStoreUserRelative>();
    for (let index in targetMapTmp) {
      let targetTmp = targetMapTmp[index];
      let chainSU = new ChainStoreUserRelative();
      AppUtils.copy(chainSU, targetTmp);
      targetMap.put(chainSU.chainId, chainSU);
    }
    return targetMap;
  }

}
