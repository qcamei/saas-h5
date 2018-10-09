import {LeaguerDetail} from "./data/LeaguerDetail";
import {AppUtils, ZmMap} from "../../comModule/AppUtils";
import {PreStoreCard} from "./data/PreStoreCard";
import {MgrPool} from "../../comModule/MgrPool";

export class LeaguerDetailHelper {

  public static getInstance(): LeaguerDetailHelper {
    return MgrPool.getInstance().get("LeaguerDetailHelper", LeaguerDetailHelper);
  }

  /**
   * 根据 preStoreCardId 获取 PreStoreCard
   *
   * @param leaguerDetail
   * @param preStoreCardId
   * @return
   */
  public getPreStoreCardById(leaguerDetail: LeaguerDetail, preStoreCardId: string): PreStoreCard {
    if (
      (leaguerDetail)) return null;
    let preStoreCardMap: ZmMap<PreStoreCard> = leaguerDetail.getPreStoreCardMap();
    let preStoreCard: PreStoreCard = preStoreCardMap.get(preStoreCardId);
    return preStoreCard;
  }
}
