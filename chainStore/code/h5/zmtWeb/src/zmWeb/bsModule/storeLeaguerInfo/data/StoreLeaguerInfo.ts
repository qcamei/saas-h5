import {Leaguer} from "./Leaguer";
import {AppUtils, ZmMap} from '../../../comModule/AppUtils';
import {EntityState} from "../../../comModule/enum/EntityState";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {LeaguerLabel} from "./LeaguerLabel";

export class StoreLeaguerInfo {
  id:string;
  storeId:string;
  leaguerInfoMap:any;
  // 标签
  labelIndex:number;
  leaguerLabelMap:any;
  // 数据拆分标识
  splitMark:number;
  createdTime:string;
  lastUpdateTime:string;
  ver:number;

  constructor(){}

  public getLeaguerMapWithPhone():ZmMap<Leaguer>{
    let leaguerMap = new ZmMap<Leaguer>();
    for(let index in this.leaguerInfoMap){
      let leaguer = new Leaguer();
      let leaguerTmp = this.leaguerInfoMap[index];
      AppUtils.copy(leaguer,leaguerTmp);
      leaguerMap.put(leaguer.phone,leaguer);
    }
    return leaguerMap;
  }

  public getLeaguerInfoList(): Array<Leaguer> {
    let leaguerInfoMap = this.leaguerInfoMap;
    let leaguerArray = new Array<Leaguer>();
    for (var key in leaguerInfoMap) {
      let leaguerTmp: Leaguer = new Leaguer();
      AppUtils.copy(leaguerTmp, leaguerInfoMap[key]);
      leaguerArray.push(leaguerTmp);
    }
    return leaguerArray;
  }

  public getAllLeaguerMap():ZmMap<Leaguer>{
    let leaguerMap = new ZmMap<Leaguer>();
    for(let index in this.leaguerInfoMap){
      let leaguer = new Leaguer();
      let leaguerTmp = this.leaguerInfoMap[index];
        if(!SessionUtil.getInstance().getUserPermData().isPhoneAdmin && !AppUtils.isNullOrWhiteSpace(leaguerTmp.phone)){
          leaguerTmp.phone = this.replaceLeaguerPhone(leaguerTmp.phone);
        }
        AppUtils.copy(leaguer,leaguerTmp);
        leaguerMap.put(leaguer.id,leaguer);
      }
    return leaguerMap;
  }

  private replaceLeaguerPhone(phoneP:string):string {
    let phoneTmp:string = phoneP;
    if (phoneP.length == 5 || phoneP.length == 6) {
      phoneTmp = phoneP.replace(phoneP.slice(1, 3), "**");
    }else if (phoneP.length == 7) {
      phoneTmp = phoneP.replace(phoneP.slice(1, 4), "***");
    }else if (phoneP.length == 8) {
      phoneTmp = phoneP.replace(phoneP.slice(2, 5), "***");
    }else if (phoneP.length == 9) {
      phoneTmp = phoneP.replace(phoneP.slice(3, 6), "***");
    }else if (phoneP.length == 10 || phoneP.length == 11) {
      phoneTmp = phoneP.replace(phoneP.slice(3, 7), "****");
    }
    return phoneTmp;
  }

  public getLeaguerMap():ZmMap<Leaguer>{
    let leaguerMap = new ZmMap<Leaguer>();
    for(let index in this.leaguerInfoMap){
      let leaguer = new Leaguer();
      AppUtils.copy(leaguer,this.leaguerInfoMap[index]);
      leaguerMap.put(leaguer.id,leaguer);
    }
    return leaguerMap;
  }

  public getEncryptLeaguerMap():ZmMap<Leaguer>{
    let leaguerMap = new ZmMap<Leaguer>();
    for(let index in this.leaguerInfoMap){
      let leaguer = new Leaguer();
      let leaguerTmp = this.leaguerInfoMap[index];
      if(!AppUtils.isNullOrWhiteSpace(leaguerTmp.phone)){
        leaguerTmp.phone = this.replaceLeaguerPhone(leaguerTmp.phone);
      }
      AppUtils.copy(leaguer,leaguerTmp);
      leaguerMap.put(leaguer.id,leaguer);
    }
    return leaguerMap;
  }

  public getValidLeaguerMap():ZmMap<Leaguer>{
    let leaguerMap = new ZmMap<Leaguer>();
    for(let index in this.leaguerInfoMap){
      let leaguer = new Leaguer();
      let leaguerTmp = this.leaguerInfoMap[index];
      if(leaguerTmp.entityState == EntityState.Normal){//有效会员
        if(!SessionUtil.getInstance().getUserPermData().isPhoneAdmin && !AppUtils.isNullOrWhiteSpace(leaguerTmp.phone)){
          leaguerTmp.phone = this.replaceLeaguerPhone(leaguerTmp.phone);
        }
        AppUtils.copy(leaguer,leaguerTmp);
        leaguerMap.put(leaguer.id,leaguer);
      }
    }
    return leaguerMap;
  }

  public getValidLeaguerLabelMap():ZmMap<LeaguerLabel>{
    let leaguerLabelMap = new ZmMap<LeaguerLabel>();
    for(let index in this.leaguerLabelMap){
      let leaguerLabel = new LeaguerLabel();
      let leaguerLabelTmp = this.leaguerLabelMap[index];
      if(leaguerLabelTmp.entityState == EntityState.Normal){//有效标签
        AppUtils.copy(leaguerLabel,leaguerLabelTmp);
        leaguerLabelMap.put(leaguerLabel.id,leaguerLabel);
      }
    }
    return leaguerLabelMap;
  }

  public getValidLeaguerLabelNameMap():ZmMap<LeaguerLabel>{
    let leaguerLabelMap = new ZmMap<LeaguerLabel>();
    for(let index in this.leaguerLabelMap){
      let leaguerLabel = new LeaguerLabel();
      let leaguerLabelTmp = this.leaguerLabelMap[index];
      if(leaguerLabelTmp.entityState == EntityState.Normal){//有效标签
        AppUtils.copy(leaguerLabel,leaguerLabelTmp);
        leaguerLabelMap.put(leaguerLabel.name,leaguerLabel);
      }
    }
    return leaguerLabelMap;
  }

}
