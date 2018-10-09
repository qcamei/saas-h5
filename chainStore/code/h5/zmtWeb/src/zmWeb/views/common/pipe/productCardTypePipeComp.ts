import {PipeTransform, Pipe} from "@angular/core";

@Pipe({name:"productCardTypePipeComp"})
export class ProductCardTypePipeComp implements PipeTransform{

  transform(productCardType: number): string {
    if(productCardType == 0){
      return "指定项目及次数";
    }else if(productCardType == 1){
      return "不限项目限次数";
    }else if(productCardType == 2){
      return "不限项目不限次数";
    }
  }
}
