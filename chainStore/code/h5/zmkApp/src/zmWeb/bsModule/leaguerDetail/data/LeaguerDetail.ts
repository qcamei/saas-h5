import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {IntfDetailData} from "../../../comModule/dataDetail/IntfDetailData";
import {PreStoreCard} from "./PreStoreCard";
import {LeaguerMemberCard} from "../../storeLeaguerInfo/data/LeaguerMemberCard";
import {LeaguerProductCard} from "../../storeLeaguerInfo/data/LeaguerProductCard";
import {LeaguerCardEnum} from "../../storeLeaguerInfo/data/LeaguerCardEnum";

export class LeaguerDetail implements IntfDetailData{
    constructor(){}
    id:string;
    storeId:number;
    cuserId:number;
    name:string;
    sex:number;
    phone:string;
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
    labelIds:Array<number>;
    originId:number;
    // 会员的预存卡信息
    leaguerPreStoreCardMap:any;//<String, PreStoreCard>


  targetId(): string {
    return this.id;
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

  // public checkLeaguerProductCard():boolean{
  //   let success = false;
  //   outer:
  //   for(let index in this.leaguerProductCardMap){
  //     let leaguerProductCard:LeaguerProductCard = this.leaguerProductCardMap[index];
  //     if(!AppUtils.isNullOrWhiteSpace(leaguerProductCard.id) && ((leaguerProductCard.state == LeaguerCardEnum.VALID) || (leaguerProductCard.state == LeaguerCardEnum.NOTUSE) || (leaguerProductCard.state == LeaguerCardEnum.USING))){
  //       let useCountMap = leaguerProductCard.useCountMap;
  //       for(let prdId in useCountMap){
  //         if((useCountMap[prdId] == -1) || (useCountMap[prdId] > 0)){
  //           success = true;
  //           break outer;
  //         }
  //       }
  //     }
  //   }
  //   return success;
  // }

  public getPreStoreCardMap():ZmMap<PreStoreCard>{
    let preStoreCardMap = new ZmMap<PreStoreCard>();
    for(let index in this.leaguerPreStoreCardMap){
      let preStoreCard = this.leaguerPreStoreCardMap[index];
      preStoreCardMap.put(preStoreCard.id,preStoreCard);
    }
    return preStoreCardMap;
  }

}
