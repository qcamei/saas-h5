import {ZmMap} from "../../../comModule/AppUtils";
import {UserBonus} from "./UserBonus";

export class BonusInfo {
// 提成ID prdCardPayType_buyType_pgId_leaguerPrdCardId
  private _bonusId: string;
  // 是否划卡结算 对应 PrdCardPayEnum
  private _prdCardPayType: number;
  // 消费购买的类型 BuyTypeEnum 次卡、项目、商品、套餐
  private _buyType: number;
  // 项目/商品/次卡/套餐的ID
  private _pgId: string;
  // 客户的次卡ID
  private _leaguerPrdCardId: string;
  // 医美师提成
  private _userBonusMap: ZmMap<UserBonus> = ZmMap.newMap<UserBonus>();


  get bonusId(): string {
    return this._bonusId;
  }

  set bonusId(value: string) {
    this._bonusId = value;
  }

  get prdCardPayType(): number {
    return this._prdCardPayType;
  }

  set prdCardPayType(value: number) {
    this._prdCardPayType = value;
  }

  get buyType(): number {
    return this._buyType;
  }

  set buyType(value: number) {
    this._buyType = value;
  }

  get pgId(): string {
    return this._pgId;
  }

  set pgId(value: string) {
    this._pgId = value;
  }

  get leaguerPrdCardId(): string {
    return this._leaguerPrdCardId;
  }

  set leaguerPrdCardId(value: string) {
    this._leaguerPrdCardId = value;
  }

  get userBonusMap(): ZmMap<UserBonus> {
    return this._userBonusMap;
  }

  set userBonusMap(value: ZmMap<UserBonus>) {
    this._userBonusMap = value;
  }
}
