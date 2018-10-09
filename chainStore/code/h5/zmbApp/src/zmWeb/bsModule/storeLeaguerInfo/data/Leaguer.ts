import {LeaguerMemberCard} from "./LeaguerMemberCard";
import {LeaguerProductCard} from "./LeaguerProductCard";
import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {LeaguerCardEnum} from "./LeaguerCardEnum";
import {SessionUtil} from "../../../comModule/session/SessionUtil";

export class Leaguer {
  id:string;
  name:string;
  sex:number;//GenderEnum
  phone:string;
  entityState:number;
  headImg:string;


  //遗留字段
  buserIds:Array<string>;
  dateType:number;// 阴历阳历 对应dateTypeEnum
  idCard:string;
  telephone:string;
  age:number;
  birthday:number;
  lunarDay:number;
  aliasName:string;
  wechatNumber:string;
  recommender:string;
  origin:string;
  address:string;
  company:string;
  job:string;
  cuserId:number;
  createdTime:string;
  lastUpdateTime:string;
  leaguerMemberCard:LeaguerMemberCard;//会员绑定的会员卡 只有一张
  leaguerProductCardMap:Array<LeaguerProductCard>;//会员购买的次卡map
  leaguerPrdCardIndex:number;//次卡自增idIndex


  attention:number;
  beauticianId:number;
  beauticianName:string;
  lastConsumeTime:number;
  firstConsumeTime:number;
  consumeAmount:number;
  consumeCount:number;
  customerType:number;
  consumeLevel:number;
  avgPrice:number;
  monthRate:number;

  //显示数据
  checked:boolean = false;
  constructor(){}

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
      if(!AppUtils.isNullOrWhiteSpace(leaguerProductCard.id) && leaguerProductCard.state == LeaguerCardEnum.VALID){
        leaguerProductCardMap.put(leaguerProductCard.id,leaguerProductCard);
      }
    }
    return leaguerProductCardMap;
  }

  // /**
  //  * 手机号码加密
  //  * @returns {LeaguerDetail}
  //  */
  // public encryptLeaguerDetail4New():Leaguer{
  //   let leaguerTmp = new Leaguer();
  //   AppUtils.copy(leaguerTmp,this);
  //   leaguerTmp.phone = leaguerTmp.phone.toString();
  //   if(!SessionUtil.getInstance().getUserPermData().isPhoneAdmin && !AppUtils.isNullOrWhiteSpace(leaguerTmp.phone)){
  //     leaguerTmp.phone = this.replaceLeaguerPhone(leaguerTmp.phone);
  //   }
  //   return leaguerTmp;
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
}
