import {AppUtils} from "../../../../comModule/AppUtils";

export class LeaguerHelper {
  /**
   * true表示散客
   *
   * @param storeId   店铺id
   * @param leaguerId 客户id
   * @return
   */
  public static isOutsider(storeId: string, leaguerId: string): boolean {
    if (AppUtils.isNullObj(leaguerId)) return false;
    let boyId: string = storeId + "_01";//散客男 id
    let girlId: string = storeId + "_02";//散客女id
    if (leaguerId === boyId || leaguerId === girlId)
      return true;
    return false;
  }
}
