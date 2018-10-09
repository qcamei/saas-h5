import {LeaguerExpandAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerExpandAttribute";
import {LeaguerAttributeStateEnum} from "../../../bsModule/storeConfig/data/leaguer/LeaguerAttributeStateEnum";
import {RequiredEnum} from "../../../bsModule/storeConfig/data/leaguer/RequiredEnum";
import {LeaguerBaseAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerBaseAttribute";
import {LeaguerConfig} from "../../../bsModule/storeConfig/data/LeaguerConfig";
import {ZmMap} from "../../../comModule/AppUtils";

export class SetAttributeViewData{
  public leaguerConfig:LeaguerConfig;
  public leaguerAttributeMap:ZmMap<LeaguerBaseAttribute> = new ZmMap<LeaguerBaseAttribute>();
  public leaguerAttributeList:Array<LeaguerAttributeItem> = new Array<LeaguerAttributeItem>();
  public expandAttributeMap:ZmMap<LeaguerExpandAttribute> = new ZmMap<LeaguerExpandAttribute>();
  public expandAttributeList:Array<ExpandAttributeItem> = new Array<ExpandAttributeItem>();
}

export class LeaguerAttributeItem{
  label:string;
  attributeName:string;
  enable:boolean;//是否启用
  require:boolean;//是否必填

  public static formBaseAttribute(leaguerBaseAttribute:LeaguerBaseAttribute):LeaguerAttributeItem{
    let leaguerAttributeItem = new LeaguerAttributeItem();
    leaguerAttributeItem.label = leaguerBaseAttribute.label;
    leaguerAttributeItem.attributeName = leaguerBaseAttribute.attributeName;
    leaguerAttributeItem.enable = leaguerBaseAttribute.status == LeaguerAttributeStateEnum.Enable;
    leaguerAttributeItem.require = leaguerBaseAttribute.require == RequiredEnum.Required;
    return leaguerAttributeItem;
  }
}

export class ExpandAttributeItem{
  id:string;
  label:string;
  enable:boolean;//是否启用
  require:boolean;//是否必填
  sort:number;
  attributeType:number;
  tips:string;

  public static formExpandAttribute(leaguerExpandAttribute:LeaguerExpandAttribute):ExpandAttributeItem{
    let expandAttributeItem = new ExpandAttributeItem();
    expandAttributeItem.id = leaguerExpandAttribute.id;
    expandAttributeItem.label = leaguerExpandAttribute.label;
    expandAttributeItem.enable = leaguerExpandAttribute.status == LeaguerAttributeStateEnum.Enable;
    expandAttributeItem.require = leaguerExpandAttribute.require == RequiredEnum.Required;
    expandAttributeItem.sort = leaguerExpandAttribute.sort;
    expandAttributeItem.attributeType = leaguerExpandAttribute.attributeType;
    expandAttributeItem.tips = leaguerExpandAttribute.tips;
    return expandAttributeItem;
  }
}
