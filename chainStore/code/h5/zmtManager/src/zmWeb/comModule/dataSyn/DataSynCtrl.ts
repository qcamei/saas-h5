import {ZmMap, AppUtils} from "../AppUtils";
import {Headers} from "@angular/http";

export class DataSynCtrl {

  public static Instance:DataSynCtrl = new DataSynCtrl();

  public readonly DATA_SYN_REQ = "dsReq";
  private ownerId:string;

  //map<intSynType,DataSynItem>
  public map:ZmMap<DataSynItem> = new ZmMap<DataSynItem>();

  constructor() {

  }

  public setOwnerId(ownerIdP:string):void {
    this.ownerId = ownerIdP;
  };

  public put(dataSynItem:DataSynItem):void{
    let intSynType = dataSynItem.synVer.synType;
    let key = this.getKey(intSynType,dataSynItem.synVer.id);
    this.map.put(key, dataSynItem);
  };

  public get<T> (constructorT:{new(): T;},synType:DataSynType,targetId:string):T{
    let target:T = null;
    let key = this.getKey(synType,targetId);
    let dataSynItem:DataSynItem = this.map.get(key);
    if(!AppUtils.isNullObj(dataSynItem)){
      if(!AppUtils.isNullObj(dataSynItem.obj) && !AppUtils.isNullOrWhiteSpace(dataSynItem.data)){
        dataSynItem.obj = AppUtils.fromJson<T>(constructorT,dataSynItem.data);
      }
      target = dataSynItem.obj;
    }
    return target;
  }

  private getKey(synType:DataSynType ,id:string):string{
    let format:string = "{0}_{1}";
    let intSynType = synType;
    let key:string = AppUtils.format(format, intSynType, id);
    return key;
  }

  public getVerList():Array<DataSynVer>{
    let verList:Array<DataSynVer> = new Array<DataSynVer>();
    let itemList:Array<DataSynItem> = this.map.values();
    for(let itemTmp of itemList){
      verList.push(itemTmp.synVer);
    }
    return verList;
  };

  public synData(dataSynResp:DataSynResp):void{
    if(dataSynResp.itemList && dataSynResp.itemList instanceof Array){
      dataSynResp.itemList.forEach((itemTmp)=>{
        this.put(itemTmp);
      });
    }

  };

  public getSynHeader():string{
    let dataSynVerInfo:DataSynVerInfo = new DataSynVerInfo();
    dataSynVerInfo.ownerId = this.ownerId;
    dataSynVerInfo.synVerList = this.getVerList();

    return AppUtils.toJson(dataSynVerInfo);
  };

  public clear(){
    this.map.clear();
  };

}

export  class DataSynResp{
  ownerId:string;
  itemList:Array<DataSynItem>;
}

export class DataSynItem{
  synVer:DataSynVer;
  data:string;
  obj:any = null;
}

export class DataSynVer{
  synType:number;
  id:string;
  ver:number;
}

class DataSynVerInfo{
  ownerId:string;
  synVerList:Array<DataSynVer>;
}

export enum DataSynType {
  CUser = 0,
  Store = 1,
  Order = 2,
  BUser = 3,
  StoreClerkInfo = 4,
  OPUser = 5,
  StoreLeaguerInfo = 6,
  Appointment = 7,
  StoreBeauticianInfo = 8,
  StoreProductInfo = 9,
  Message = 10,
  StoreMaterialInfo = 11,
  MaterialRecords = 12,
  SpecialData = 13,
  ClerkSalary = 14,
  StoreCardInfo = 15,
  LeaguerAffair = 16,
  CardRecord = 17,
  MaterialReport = 18,
  OrderReport = 19,
  OrderComment = 20,
  BeauticianProduct = 21,
  Schedule = 22,
  CardOrder = 23,
  AppVersion = 24,
  StoreVipType =25,
  VipRechargeRecord = 26,
  ServerConfig = 27,
  StoreGoods = 28,
  WorkFlowType = 29,
  WorkFlowData = 30,
  StoreOrder = 31,
  BonusRecord = 32,
  EUser = 33,
  BUserDevice = 34,
  MUser=35,
  MngDevice=36,
}

