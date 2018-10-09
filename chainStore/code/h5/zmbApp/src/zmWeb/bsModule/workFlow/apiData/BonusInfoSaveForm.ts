import {UserBonus} from "../data/UserBonus";
import {ZmMap} from "../../../comModule/AppUtils";

export class BonusInfoSaveForm {
  // 是否划卡结算 对应 PrdCardPayEnum
  private _prdCardPayType: number;
  // 消费购买的类型 BuyTypeEnum 次卡、项目、商品、套餐
  private _buyType: number;
  // 项目/商品/次卡/套餐的ID
  private _pgId: string;
  // 划卡的次卡ID
  private _leaguerPrdCardId: string;
  // 医美师提成
  private _userBonusMap: ZmMap<UserBonus> = ZmMap.newMap<UserBonus>();


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
