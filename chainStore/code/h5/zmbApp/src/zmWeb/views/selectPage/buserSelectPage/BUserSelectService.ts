import {MgrPool} from "../../../comModule/MgrPool";
import {BUser} from "../../../bsModule/buser/data/BUser";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreClerkInfo} from "../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {AppUtils} from "../../../comModule/AppUtils";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";

export class BUserSelectService {

  public static getInstance(): BUserSelectService {
    return MgrPool.getInstance().get("BUserSelectService", BUserSelectService);
  }

  /**
   * 获取所有有效的员工
   * @returns {Promise<Array<BUser>>}
   */
  public async getAllBUsers(): Promise<Array<BUser>> {
    let busers = new Array<BUser>();
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let store = await StoreSynDataHolder.getInstance().getData(storeId);
    let storeClerkInfo: StoreClerkInfo = await StoreClerkInfoSynDataHolder.getInstance().getData(store.clerkInfoId);
    let validClerkMap = storeClerkInfo.getValidClerkMap();
    if(AppUtils.isNullObj(validClerkMap)|| AppUtils.isEmpty(validClerkMap.keys())){
      return AppUtils.getPromise(busers);
    }
    busers = await BUserMgr.getInstance().findByMultitId(validClerkMap.keys());
    return AppUtils.getPromise(busers);
  }
}
