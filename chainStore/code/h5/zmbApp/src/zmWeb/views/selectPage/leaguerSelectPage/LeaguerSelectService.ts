import {MgrPool} from "../../../comModule/MgrPool";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreClerkInfo} from "../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {StoreLeaguerInfo} from "../../../bsModule/storeLeaguerInfo/data/StoreLeaguerInfo";
import {EntityState} from "../../../comModule/enum/EntityState";

export class LeaguerSelectService {

  public static getInstance(): LeaguerSelectService {
    return MgrPool.getInstance().get("LeaguerSelectService", LeaguerSelectService);
  }

  /**
   * 获取所有有效的会员
   * @returns {Promise<Array<Leaguer>>}
   */
  public async getAllLeaguers(): Promise<ZmMap<Leaguer>> {
    let leaguers = ZmMap.newMap<Leaguer>();
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let storeLeaguerInfo: StoreLeaguerInfo = await StoreLeaguerInfoSynDataHolder.getInstance().getData(storeId);
    let leaguerMap = storeLeaguerInfo.leaguerInfoMap;
    for(let index in leaguerMap){
      let leaguerTmp = leaguerMap[index];
      let leaguer = new Leaguer();
      if(leaguerTmp.entityState == EntityState.Normal) {//有效会员
        AppUtils.copy(leaguer, leaguerTmp);
        leaguers.put(leaguer.id, leaguer);
      }
    }
    return AppUtils.getPromise(leaguers);
  }
}
