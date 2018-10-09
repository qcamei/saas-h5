import {PipeTransform, Pipe} from "@angular/core";
import {ItemTypeEnum} from "../../../comModule/enum/ItemTypeEnum";

/***产品类型管道**/

@Pipe({name:"itemTypePipe"})
export class ItemTypePipe implements PipeTransform{

  transform(type:number): string {
    if(type == ItemTypeEnum.PRODUCT){
      return "项目";
    }else if(type == ItemTypeEnum.GOODS){
      return "商品";
    }else if(type == ItemTypeEnum.PACKAGE){
      return "套餐";
    }else{
      return "-";
    }
  }
}
