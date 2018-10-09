import {LeaguerMemberCard} from "../../storeLeaguerInfo/data/LeaguerMemberCard";
import {LeaguerProductCard} from "../../storeLeaguerInfo/data/LeaguerProductCard";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {LeaguerCardEnum} from "../../storeLeaguerInfo/data/LeaguerCardEnum";
import {IntfDetailData} from "../../../comModule/dataDetail/IntfDetailData";
import {PreStoreCard} from "./PreStoreCard";

export class LeaguerDetail implements IntfDetailData{
    constructor(){}
    id:string;
    storeId:number;
    cuserId:number;
    name:string;
    namePass:boolean;
    sex:number;
    phone:string;
    phonePass:boolean;
    entityState:number;
    headImg:string;
    buserIds:Array<string>;
    birthday:number;
    dateType:number;
    idCard:string;
    aliasName:string;
    wechatNumber:string;
    recommender:string;
    origin:string;
    address:string;
    company:string;
    job:string;
    createdTime:number;
    lastUpdateTime:string;
    ver:number;
    lastConsumeTime:number;
    firstConsumeTime:number;
    consumeAmount:number;
    consumeCount:number;
    avgPrice:number;
    monthRate:number;
    leaguerMemberCard:LeaguerMemberCard;
    leaguerProductCardMap:Array<LeaguerProductCard>;
    leaguerPrdCardIndex:number;
    telephone:string;
    age:number;
    lunarDay:number;
    customerType:number;
    consumeLevel:number;
    attention:number;
    beauticianId:number;
    beauticianName:string;
    //会员扩展属性 <LeaguerExpandAttribute.id, value>
    expandAttrMap:any;
    //标签
    labelIds:Array<string>;
    originId:number;
    // 会员的预存卡信息
    leaguerPreStoreCardMap:any;//<String, PreStoreCard>


  targetId(): string {
    return this.id;
  }

  // /**
  //  * 手机号码加密
  //  * @returns {LeaguerDetail}
  //  */
  // public encryptLeaguerDetail():LeaguerDetail{
  //   // this.phone = this.phone.toString();
  //   // if(!SessionUtil.getInstance().getUserPermData().isPhoneAdmin && !AppUtils.isNullOrWhiteSpace(this.phone)){
  //   //   this.phone = this.replaceLeaguerPhone(this.phone);
  //   // }
  //   // return this;
  //   // return this.encryptLeaguerDetail4New();
  // }

  // /**
  //  * 手机号码加密
  //  * @returns {LeaguerDetail}
  //  */
  // public encryptLeaguerDetail4New():LeaguerDetail{
  //   let leaguerDetailTmp = new LeaguerDetail();
  //   AppUtils.copy(leaguerDetailTmp,this);
  //   leaguerDetailTmp.phone = leaguerDetailTmp.phone.toString();
  //   if(!SessionUtil.getInstance().getUserPermData().isPhoneAdmin && !AppUtils.isNullOrWhiteSpace(leaguerDetailTmp.phone)){
  //     leaguerDetailTmp.phone = this.replaceLeaguerPhone(leaguerDetailTmp.phone);
  //   }
  //   return leaguerDetailTmp;
  // }

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

  public getLeaguerProductCardMap():ZmMap<LeaguerProductCard>{
    let leaguerProductCardMap = new ZmMap<LeaguerProductCard>();
    for(let index in this.leaguerProductCardMap){
      let leaguerProductCard = this.leaguerProductCardMap[index];
      if(!AppUtils.isNullOrWhiteSpace(leaguerProductCard.id)){
        leaguerProductCardMap.put(leaguerProductCard.id,leaguerProductCard);
      }
    }
    return leaguerProductCardMap;
  }

  public getValidLeaguerProductCardMap():ZmMap<LeaguerProductCard>{
    let leaguerProductCardMap = new ZmMap<LeaguerProductCard>();
    for(let index in this.leaguerProductCardMap){
      let leaguerProductCard = this.leaguerProductCardMap[index];
      if(!AppUtils.isNullOrWhiteSpace(leaguerProductCard.id) && ((leaguerProductCard.state == LeaguerCardEnum.VALID) || (leaguerProductCard.state == LeaguerCardEnum.NOTUSE) || (leaguerProductCard.state == LeaguerCardEnum.USING))){
        leaguerProductCardMap.put(leaguerProductCard.id,leaguerProductCard);
      }
    }
    return leaguerProductCardMap;
  }

  public checkLeaguerProductCard():boolean{
    let success = false;
    outer:
    for(let index in this.leaguerProductCardMap){
      let leaguerProductCard:LeaguerProductCard = this.leaguerProductCardMap[index];
      if(!AppUtils.isNullOrWhiteSpace(leaguerProductCard.id) && ((leaguerProductCard.state == LeaguerCardEnum.VALID) || (leaguerProductCard.state == LeaguerCardEnum.NOTUSE) || (leaguerProductCard.state == LeaguerCardEnum.USING))){
        let useCountMap = leaguerProductCard.useCountMap;
        for(let prdId in useCountMap){
          if((useCountMap[prdId] == -1) || (useCountMap[prdId] > 0)){
            success = true;
            break outer;
          }
        }
      }
    }
    return success;
  }

  public getExpandAttributeMap():ZmMap<string>{
    let expandAttributeMap = new ZmMap<string>();
    for(let index in this.expandAttrMap){
      let expandAttributeValue = this.expandAttrMap[index];
      expandAttributeMap.put(index,expandAttributeValue);
    }
    return expandAttributeMap;
  }

  public getPreStoreCardMap():ZmMap<PreStoreCard>{
    let preStoreCardMap = new ZmMap<PreStoreCard>();
    for(let index in this.leaguerPreStoreCardMap){
      let preStoreCard = this.leaguerPreStoreCardMap[index];
      preStoreCardMap.put(preStoreCard.id,preStoreCard);
    }
    return preStoreCardMap;
  }

}
