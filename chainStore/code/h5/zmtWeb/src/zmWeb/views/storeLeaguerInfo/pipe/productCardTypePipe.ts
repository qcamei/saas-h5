import {PipeTransform, Pipe} from "@angular/core";
import {ProductCardTypeEnum} from "../../../bsModule/storeCardInfo/data/ProductCardTypeEnum";

@Pipe({name:"productCardTypePipe"})
export class ProductCardTypePipe implements PipeTransform{

  transform(productCardType: number): string {
    if(productCardType == ProductCardTypeEnum.LIMIT_PRDANDTIME){
      return "指定项目及次数";
    }else if(productCardType == ProductCardTypeEnum.LIMIT_TIMEBUTPRD){
      return "不限项目限次数";
    }else if(productCardType == ProductCardTypeEnum.NOLIMIT_PRDANDTIME){
      return "不限项目不限次数";
    }
  }
}
