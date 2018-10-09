import {AppointInfo} from "./AppointInfo";
import {LeaguerInfo} from "./LeaguerInfo";
import {PreStoreCardRecord} from "./PreStoreCardRecord";
import {CancelReason} from "../../appointment/data/CancelReason";
import {BonusInfo} from "./BonusInfo";
import {OrderInfo} from "./OrderInfo";
import {MemCardInfo} from "./MemCardInfo";
import {PackagePrjRecord} from "./PackagePrjRecord";
import {GoodsRecord} from "./GoodsRecord";
import {PrdCardRecord} from "./PrdCardRecord";
import {ProdRecord} from "./ProdRecord";
import {DelimitCardRecord} from "./DelimitCardRecord";
import {WorkFlowDataStatusEnum} from "./WorkFlowDataStatusEnum";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";

export class WorkFlowData {
  private _id: number;
  // 店铺ID
  private _storeId: number;
  // 创建者ID
  private _buserId: number;
  // 工作流ID
  private _workFlowTypeId: number;
  // 状态 WorkflowDataStatusEnum
  /**
   * @link{WorkFlowDataStatusEnum}
   */
  private _status: number;
  private _entityState: number;

  // 流程编号
  private _number: string;
  // 开单类型 WfDataTypeEnum 补单、开单
  private _recordType: number;
  // 补单时间
  private _orderTime: number;

  // 预约信息
  private _appointInfo: AppointInfo;
  // 客户信息
  private _leaguerInfo: LeaguerInfo;

  // 预存卡
  private _preStoreCardRecordMap: any;

  // 划卡
  private _delimitCardRecordMap: any;

  // 项目
  private _prodRecordMap: any;

  // 购买次卡
  private _prdCardRecordMap: any;

  // 购买商品
  private _goodsRecordMap: any;

  // 购买套餐
  private _packagePrjRecordMap: any;

  // 会员充值信息
  private _memCardInfo: MemCardInfo;

  // 订单信息
  private _orderInfo: OrderInfo;

  // 提成信息
  private _bonusInfoMap: any;

  // 流程作废信息
  private _cancelReason: CancelReason;

  private _createdTime: number;
  private _lastUpdateTime: number;
  private _ver: number;


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

  get buserId(): number {
    return this._buserId;
  }

  set buserId(value: number) {
    this._buserId = value;
  }

  get workFlowTypeId(): number {
    return this._workFlowTypeId;
  }

  set workFlowTypeId(value: number) {
    this._workFlowTypeId = value;
  }

  get status(): number {
    return this._status;
  }

  set status(value: number) {
    this._status = value;
  }

  get entityState(): number {
    return this._entityState;
  }

  set entityState(value: number) {
    this._entityState = value;
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

  get appointInfo(): AppointInfo {
    return this._appointInfo;
  }

  set appointInfo(value: AppointInfo) {
    this._appointInfo = value;
  }

  get leaguerInfo(): LeaguerInfo {
    return this._leaguerInfo;
  }

  set leaguerInfo(value: LeaguerInfo) {
    this._leaguerInfo = value;
  }

  get preStoreCardRecordMap(): any {
    if(!AppUtils.isNullObj(this._preStoreCardRecordMap)){
      let preStoreCardRecordMap = new ZmMap<PreStoreCardRecord>();
      for(let index in this._preStoreCardRecordMap){
        let preStoreCardRecord = new PreStoreCardRecord();
        AppUtils.copy(preStoreCardRecord,this._preStoreCardRecordMap[index]);
        preStoreCardRecordMap.put(preStoreCardRecord.id,preStoreCardRecord);
      }
      return preStoreCardRecordMap
    }
    return this._preStoreCardRecordMap;
  }

  set preStoreCardRecordMap(value: any) {
    this._preStoreCardRecordMap = value;
  }

  get delimitCardRecordMap(): any {
    if(!AppUtils.isNullObj(this._delimitCardRecordMap)){
      let delimitCardRecordMap = new ZmMap<DelimitCardRecord>();
      for(let index in this._delimitCardRecordMap){
        let delimitCardRecord = new DelimitCardRecord();
        AppUtils.copy(delimitCardRecord,this._delimitCardRecordMap[index]);
        delimitCardRecordMap.put(delimitCardRecord.delimitCardId,delimitCardRecord);
      }
      return delimitCardRecordMap
    }
    return this._delimitCardRecordMap;
  }

  set delimitCardRecordMap(value: any) {
    this._delimitCardRecordMap = value;
  }

  get prodRecordMap(): any {
    if(!AppUtils.isNullObj(this._prodRecordMap)){
      let prodRecordMap = new ZmMap<ProdRecord>();
      for(let index in this._prodRecordMap){
        let prodRecord = new ProdRecord();
        AppUtils.copy(prodRecord,this._prodRecordMap[index]);
        prodRecordMap.put(prodRecord.id,prodRecord);
      }
      return prodRecordMap
    }
    return this._prodRecordMap;
  }

  set prodRecordMap(value: any) {
    this._prodRecordMap = value;
  }

  get prdCardRecordMap(): any {
    if(!AppUtils.isNullObj(this._prdCardRecordMap)){
      let prdCardRecordMap = new ZmMap<PrdCardRecord>();
      for(let index in this._prdCardRecordMap){
        let prdCardRecord = new PrdCardRecord();
        AppUtils.copy(prdCardRecord,this._prdCardRecordMap[index]);
        prdCardRecordMap.put(prdCardRecord.id,prdCardRecord);
      }
      return prdCardRecordMap
    }
    return this._prdCardRecordMap;
  }

  set prdCardRecordMap(value: any) {
    this._prdCardRecordMap = value;
  }

  get goodsRecordMap(): any {
    if(!AppUtils.isNullObj(this._goodsRecordMap)){
      let goodsRecordMap = new ZmMap<GoodsRecord>();
      for(let index in this._goodsRecordMap){
        let goodsRecord = new GoodsRecord();
        AppUtils.copy(goodsRecord,this._goodsRecordMap[index]);
        goodsRecordMap.put(goodsRecord.id,goodsRecord);
      }
      return goodsRecordMap
    }
    return this._goodsRecordMap;
  }

  set goodsRecordMap(value: any) {
    this._goodsRecordMap = value;
  }

  get packagePrjRecordMap(): any {
    if(!AppUtils.isNullObj(this._packagePrjRecordMap)){
      let packagePrjRecordMap = new ZmMap<PackagePrjRecord>();
      for(let index in this._packagePrjRecordMap){
        let packagePrjRecord = new PackagePrjRecord();
        AppUtils.copy(packagePrjRecord,this._packagePrjRecordMap[index]);
        packagePrjRecordMap.put(packagePrjRecord.id,packagePrjRecord);
      }
      return packagePrjRecordMap
    }
    return this._packagePrjRecordMap;
  }

  set packagePrjRecordMap(value: any) {
    this._packagePrjRecordMap = value;
  }

  get memCardInfo(): MemCardInfo {
    return this._memCardInfo;
  }

  set memCardInfo(value: MemCardInfo) {
    this._memCardInfo = value;
  }

  get orderInfo(): OrderInfo {
    return this._orderInfo;
  }

  set orderInfo(value: OrderInfo) {
    this._orderInfo = value;
  }

  get bonusInfoMap(): any {
    if(!AppUtils.isNullObj(this._bonusInfoMap)){
      let bonusInfoMap = new ZmMap<BonusInfo>();
      for(let index in this._bonusInfoMap){
        let bonusInfo = new BonusInfo();
        AppUtils.copy(bonusInfo,this._bonusInfoMap[index]);
        bonusInfoMap.put(bonusInfo.bonusId,bonusInfo);
      }
      return bonusInfoMap
    }
    return this._bonusInfoMap;
  }

  set bonusInfoMap(value: any) {
    this._bonusInfoMap = value;
  }

  get cancelReason(): CancelReason {
    return this._cancelReason;
  }

  set cancelReason(value: CancelReason) {
    this._cancelReason = value;
  }

  get createdTime(): number {
    return this._createdTime;
  }

  set createdTime(value: number) {
    this._createdTime = value;
  }

  get lastUpdateTime(): number {
    return this._lastUpdateTime;
  }

  set lastUpdateTime(value: number) {
    this._lastUpdateTime = value;
  }

  get ver(): number {
    return this._ver;
  }

  set ver(value: number) {
    this._ver = value;
  }
}
