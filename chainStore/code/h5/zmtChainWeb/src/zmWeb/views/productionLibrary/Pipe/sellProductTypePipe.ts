import {Pipe, PipeTransform} from "@angular/core";
import {SellProductTypeEnum} from "../../../bsModule/sellProduct/data/SellProductTypeEnum";

@Pipe({name:'sellProductTypePipe'})
export class SellProductTypePipe implements PipeTransform{
  transform(sellProductType:string){
    if(typeof(sellProductType)=="string"){
      if(parseInt(sellProductType) === SellProductTypeEnum.PRODUCT){
        return "项目";
      }else if(parseInt(sellProductType) === SellProductTypeEnum.GOODS){
        return "商品";
      }else if(parseInt(sellProductType) === SellProductTypeEnum.PACKAGE){
        return "套餐";
      }else if(parseInt(sellProductType) === SellProductTypeEnum.PRDCARD){
        return "次卡";
      }
    }else if(typeof(sellProductType)=="number"){
      if(sellProductType === SellProductTypeEnum.PRODUCT){
        return "项目";
      }else if(sellProductType === SellProductTypeEnum.GOODS){
        return "商品";
      }else if(sellProductType === SellProductTypeEnum.PACKAGE){
        return "套餐";
      }else if(sellProductType === SellProductTypeEnum.PRDCARD){
        return "次卡";
      }
    }

  }
}


