import {LeaguerSaveForm} from "./LeaguerSaveForm";
import {PreStoreCardRecordSaveForm} from "./PreStoreCardRecordSaveForm";
import {MemCardInfo} from "../data/MemCardInfo";
import {BonusInfoSaveForm} from "./BonusInfoSaveForm";
import {DonateItemSaveForm} from "./DonateItemSaveForm";
import {BuyItemSaveForm} from "./BuyItemSaveForm";
import {DelimitCardRecordSaveForm} from "./DelimitCardRecordSaveForm";

export class WorkFlowDataSaveForm {
  private _id: number;
  // 店铺ID
  private _storeId: number;
  private _saveType: number;
  // 流程编号
  private _number: string;
  // 开单类型 WfDataTypeEnum 补单、开单
  private _recordType: number;
  // 补单时间
  private _orderTime: number;

  // 客户信息
  private _leaguerSaveForm: LeaguerSaveForm;

  // 预存卡信息
  private _preStoreCardRecordSaveForms: Array<PreStoreCardRecordSaveForm> = new Array<PreStoreCardRecordSaveForm>();

  // 划卡信息
  private _delimitCardRecordSaveForms: Array<DelimitCardRecordSaveForm> = new Array<DelimitCardRecordSaveForm>();

  // 消费项
  private _buyItemSaveForms: Array<BuyItemSaveForm> = new Array<BuyItemSaveForm>();

  // 赠送项
  private _donateItemSaveForms: Array<DonateItemSaveForm> = new Array<DonateItemSaveForm>();

  // 提成信息
  private _bonusInfoSaveForms: Array<BonusInfoSaveForm> = new Array<BonusInfoSaveForm>();

  // 会员充值
  private _memCardInfo: MemCardInfo;


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get storeId(): number {
    return this._storeId;
  }

  set storeId(value: number) {
    this._storeId = value;
  }

  get saveType(): number {
    return this._saveType;
  }

  set saveType(value: number) {
    this._saveType = value;
  }

  get number(): string {
    return this._number;
  }

  set number(value: string) {
    this._number = value;
  }

  get recordType(): number {
    return this._recordType;
  }

  set recordType(value: number) {
    this._recordType = value;
  }

  get orderTime(): number {
    return this._orderTime;
  }

  set orderTime(value: number) {
    this._orderTime = value;
  }

  get leaguerSaveForm(): LeaguerSaveForm {
    return this._leaguerSaveForm;
  }

  set leaguerSaveForm(value: LeaguerSaveForm) {
    this._leaguerSaveForm = value;
  }

  get preStoreCardRecordSaveForms(): Array<PreStoreCardRecordSaveForm> {
    return this._preStoreCardRecordSaveForms;
  }

  set preStoreCardRecordSaveForms(value: Array<PreStoreCardRecordSaveForm>) {
    this._preStoreCardRecordSaveForms = value;
  }

  get delimitCardRecordSaveForms(): Array<DelimitCardRecordSaveForm> {
    return this._delimitCardRecordSaveForms;
  }

  set delimitCardRecordSaveForms(value: Array<DelimitCardRecordSaveForm>) {
    this._delimitCardRecordSaveForms = value;
  }

  get buyItemSaveForms(): Array<BuyItemSaveForm> {
    return this._buyItemSaveForms;
  }

  set buyItemSaveForms(value: Array<BuyItemSaveForm>) {
    this._buyItemSaveForms = value;
  }

  get donateItemSaveForms(): Array<DonateItemSaveForm> {
    return this._donateItemSaveForms;
  }

  set donateItemSaveForms(value: Array<DonateItemSaveForm>) {
    this._donateItemSaveForms = value;
  }

  get bonusInfoSaveForms(): Array<BonusInfoSaveForm> {
    return this._bonusInfoSaveForms;
  }

  set bonusInfoSaveForms(value: Array<BonusInfoSaveForm>) {
    this._bonusInfoSaveForms = value;
  }

  get memCardInfo(): MemCardInfo {
    return this._memCardInfo;
  }

  set memCardInfo(value: MemCardInfo) {
    this._memCardInfo = value;
  }
}
