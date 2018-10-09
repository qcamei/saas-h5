import {LeaguerExpandAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerExpandAttribute";
import {RequiredEnum} from "../../../bsModule/storeConfig/data/leaguer/RequiredEnum";
import {AttributeTypeEnum} from "../../../bsModule/storeConfig/data/leaguer/AttributeTypeEnum";

export class ExpandAttributeItem{
  id:string;
  label:string;
  require:boolean;
  tips:string;
  attributeType:number;
  value:string;
  length:number;//长度
  sort:number;

  public static formExpandAttribute(leaguerExpandAttribute:LeaguerExpandAttribute,value?:string):ExpandAttributeItem{
    let expandAttributeItem = new ExpandAttributeItem();
    expandAttributeItem.id = leaguerExpandAttribute.id;
    expandAttributeItem.label = leaguerExpandAttribute.label;
    expandAttributeItem.require = leaguerExpandAttribute.require == RequiredEnum.Required?true:false;
    expandAttributeItem.attributeType = leaguerExpandAttribute.attributeType;
    // expandAttributeItem.tips = (leaguerExpandAttribute.tips?leaguerExpandAttribute.tips:"") + (leaguerExpandAttribute.require == RequiredEnum.Required?"(必填)":"(选填)");
    expandAttributeItem.tips = leaguerExpandAttribute.tips?leaguerExpandAttribute.tips:"";
    expandAttributeItem.length = leaguerExpandAttribute.attributeType == AttributeTypeEnum.SingleLine?30:100;//0为单行30字 ,1为多行100字
    expandAttributeItem.sort = leaguerExpandAttribute.sort;
    expandAttributeItem.value = value?value:undefined;
    return expandAttributeItem;
  }

}
