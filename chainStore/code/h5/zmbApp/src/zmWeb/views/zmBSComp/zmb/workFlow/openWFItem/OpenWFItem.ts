import {BuyTypeEnum} from "../../../../../bsModule/order/data/BuyTypeEnum";
import {WFDataTypeEnum} from "./WFDataTypeEnum";
import {OpenWFItemEnum} from "./OpenWFItemEnum";

export class OpenWFItem{

  // 客户预存卡ID
  private _preStoreCardId: string;
  // 客户次卡ID
  private _leaguerPrdCardId: string;
  // 类型 ProductCardItemEnum
  private _itemType: number;
  // 项目/商品/次卡/套餐的ID
  private _pgId: string;
  // 抵消次数或者数量
  private _count: number;
  // 购买类型 BuyTypeEnum
  private _buyType: number;
  // 原价
  private _oldPrice: number;
  // 折扣
  private _discount: number;
  // 预存数量
  private _restCount: number;
  //图片
  private _name: string;
  //名称
  private _img: string;
  //分类
  private _type: string;
  /**
   * 开单列表枚举: 预存卡、划卡、购买、赠送
   * @link{OpenWFItemEnum}
   */
  private _openWFItemEnum: number;
  /**
   * 列表项的 数据类型 项目 商品 套餐 次卡
   * @link{WFDataTypeEnum}
   */
  private _wfDataTypeEnum: number;

  public static newInstance(): OpenWFItem{
    return new OpenWFItem();
  }

  get preStoreCardId(): string {
    return this._preStoreCardId;
  }

  set preStoreCardId(value: string) {
    this._preStoreCardId = value;
  }

  get itemType(): number {
    return this._itemType;
  }

  set itemType(value: number) {
    this._itemType = value;
  }

  get pgId(): string {
    return this._pgId;
  }

  set pgId(value: string) {
    this._pgId = value;
  }

  get count(): number {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
  }

  get leaguerPrdCardId(): string {
    return this._leaguerPrdCardId;
  }

  set leaguerPrdCardId(value: string) {
    this._leaguerPrdCardId = value;
  }

  get buyType(): number {
    return this._buyType;
  }

  set buyType(value: number) {
    this._buyType = value;
  }

  get oldPrice(): number {
    return this._oldPrice;
  }

  set oldPrice(value: number) {
    this._oldPrice = value;
  }

  get discount(): number {
    return this._discount;
  }

  set discount(value: number) {
    this._discount = value;
  }

  get restCount(): number {
    return this._restCount;
  }

  set restCount(value: number) {
    this._restCount = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get img(): string {
    return this._img;
  }

  set img(value: string) {
    this._img = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }


  get openWFItemEnum(): number {
    return this._openWFItemEnum;
  }

  set openWFItemEnum(value: number) {
    this._openWFItemEnum = value;
  }

  get wfDataTypeEnum(): number {
    return this._wfDataTypeEnum;
  }

  set wfDataTypeEnum(value: number) {
    this._wfDataTypeEnum = value;
  }
}
