import {WorkFlowData} from "./WorkFlowData";
import {OpenWFItem} from "../../../views/zmBSComp/zmb/workFlow/openWFItem/OpenWFItem";
import {BonusInfoSaveForm} from "../apiData/BonusInfoSaveForm";
import {Leaguer} from "../../storeLeaguerInfo/data/Leaguer";
import {BUser} from "../../buser/data/BUser";
import {LeaguerDetail} from "../../leaguerDetail/data/LeaguerDetail";

/**
 * 工作流 WorkFlowData 包装类
 */
export class WFWrap {
  private _wf: WorkFlowData;
  //客户
  private _leaguer: Leaguer;
  //跟进人员
  private _buser: BUser;

  // 预存卡信息
  private _preStoreCardRecordSaveForms: Array<OpenWFItem> = new Array<OpenWFItem>();

  // 划卡信息
  private _delimitCardRecordSaveForms: Array<OpenWFItem> = new Array<OpenWFItem>();

  // 消费项
  private _buyItemSaveForms: Array<OpenWFItem> = new Array<OpenWFItem>();

  // 赠送项
  private _donateItemSaveForms: Array<OpenWFItem> = new Array<OpenWFItem>();

  // 提成信息
  private _bonusInfoSaveForms: Array<BonusInfoSaveForm> = new Array<BonusInfoSaveForm>();

  public static newInstance(): WFWrap {
    return new WFWrap();
  }

  get wf(): WorkFlowData {
    return this._wf;
  }

  set wf(value: WorkFlowData) {
    this._wf = value;
  }

  get leaguer(): Leaguer {
    return this._leaguer;
  }

  set leaguer(value: Leaguer) {
    this._leaguer = value;
  }

  get buser(): BUser {
    return this._buser;
  }

  set buser(value: BUser) {
    this._buser = value;
  }

  get preStoreCardRecordSaveForms(): Array<OpenWFItem> {
    return this._preStoreCardRecordSaveForms;
  }

  set preStoreCardRecordSaveForms(value: Array<OpenWFItem>) {
    this._preStoreCardRecordSaveForms = value;
  }

  get delimitCardRecordSaveForms(): Array<OpenWFItem> {
    return this._delimitCardRecordSaveForms;
  }

  set delimitCardRecordSaveForms(value: Array<OpenWFItem>) {
    this._delimitCardRecordSaveForms = value;
  }

  get buyItemSaveForms(): Array<OpenWFItem> {
    return this._buyItemSaveForms;
  }

  set buyItemSaveForms(value: Array<OpenWFItem>) {
    this._buyItemSaveForms = value;
  }

  get donateItemSaveForms(): Array<OpenWFItem> {
    return this._donateItemSaveForms;
  }

  set donateItemSaveForms(value: Array<OpenWFItem>) {
    this._donateItemSaveForms = value;
  }

  get bonusInfoSaveForms(): Array<BonusInfoSaveForm> {
    return this._bonusInfoSaveForms;
  }

  set bonusInfoSaveForms(value: Array<BonusInfoSaveForm>) {
    this._bonusInfoSaveForms = value;
  }
}
