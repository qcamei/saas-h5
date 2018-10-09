import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {ChainStore} from "./ChainStore";
export class Chain {
  constructor() {
  }

  id: string;
  bossId: number;

  name: string;
  namePass:boolean;
  contactNumber: string;
  contactNumberPass:boolean;
  contacts: string;
  contactsPass:boolean;

  descript: string;
  area: string;
  address: string;
  number: string;
  chainStoreMap: any; //Map<ChainStore>已加入连锁店的店铺列表
  applyStoreMap: any;//Map<ChainStore> 申请加入连锁店的店铺列表
  state: number;//ChainState
  entityState: number;
  createdTime: number;
  lastUpdateTime: number;
  ver: number;


  public getChainStoreMap() {
    let targetMapTmp = this.chainStoreMap;
    let targetMap = new ZmMap<ChainStore>();
    for (let index in targetMapTmp) {
      let targetTmp = targetMapTmp[index];
      let chainStore = new ChainStore();
      AppUtils.copy(chainStore, targetTmp);
      targetMap.put(chainStore.storeId, chainStore);
    }
    return targetMap;
  }

  public getApplyStoreMap() {
    let targetMapTmp = this.applyStoreMap;
    let targetMap = new ZmMap<ChainStore>();
    for (let index in targetMapTmp) {
      let targetTmp = targetMapTmp[index];
      let chainStore = new ChainStore();
      AppUtils.copy(chainStore, targetTmp);
      targetMap.put(chainStore.storeId, chainStore);
    }
    return targetMap;
  }

}
