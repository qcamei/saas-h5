import {MgrPool} from "../../../../comModule/MgrPool";
import {Leaguer} from "../../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {StoreLeaguerInfoSynDataHolder} from "../../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreLeaguerInfo} from "../../../../bsModule/storeLeaguerInfo/data/StoreLeaguerInfo";
import {LeaguerDetail} from "../../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {LeaguerDetailMgr} from "../../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {StoreLeaguerInfoMgr} from "../../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoMgr";

export class LeaguerInfoService {

  public static getInstance(): LeaguerInfoService {
    return MgrPool.getInstance().get("LeaguerInfoService", LeaguerInfoService);
  }

  /**
   * 获取客户简版信息
   * @param {string} id
   * @returns {Leaguer}
   */
  public getSimpleLeaguerInfo(id: string): Promise<Leaguer> {
    return new Promise(resolve => {
      let curStoreId = SessionUtil.getInstance().getCurStoreId();
      StoreLeaguerInfoSynDataHolder.getInstance().getData(curStoreId).then(
        (storeLeaguerInfo: StoreLeaguerInfo) => {
          let leaguerMap = storeLeaguerInfo.getLeaguerMap();
          let leaguer: Leaguer = leaguerMap.get(id);
          resolve(leaguer);
        }
      );
    });
  }

  /**
   * 获取客户详情
   * @param {string} id
   * @returns {Leaguer}
   */
  public getLeaguerDetail(id: string): Promise<LeaguerDetail> {
    return new Promise(resolve => {
      let curStoreId = SessionUtil.getInstance().getCurStoreId();
      LeaguerDetailMgr.getInstance().get(id).then(
        (leaguerDetail: LeaguerDetail) => {
          resolve(leaguerDetail);
        }
      );
    });
  }

  /**
   * 添加标星
   * @param {string} leaguerId
   * @returns {Promise<boolean>}
   */
  public addAttention(leaguerId: string): Promise<boolean> {
    return new Promise(resolve => {
      let curStoreId = SessionUtil.getInstance().getCurStoreId();
      StoreLeaguerInfoMgr.getInstance().addAttention(curStoreId, leaguerId).then(
        (isSuccess: boolean) => {
          resolve(isSuccess);
        }
      );
    });
  }

  /**
   * 删除标星
   * @param {string} leaguerId
   * @returns {Promise<boolean>}
   */
  public removeAttention(leaguerId: string): Promise<boolean> {
    return new Promise(resolve => {
      let curStoreId = SessionUtil.getInstance().getCurStoreId();
      StoreLeaguerInfoMgr.getInstance().removeAttention(curStoreId, leaguerId).then(
        (isSuccess: boolean) => {
          resolve(isSuccess);
        }
      );
    });
  }

}
