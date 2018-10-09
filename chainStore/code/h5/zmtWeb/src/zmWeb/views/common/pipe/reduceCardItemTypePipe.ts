import {PipeTransform, Pipe} from "@angular/core";

@Pipe({name:"reduceCardItemTypePipe"})
export class ReduceCardItemTypePipe implements PipeTransform{

  transform(itemType: number): string {
    if(itemType == 0){
      return "项目";
    }else if(itemType == 1){
      return "商品";
    }else if(itemType == 2){
      return "套餐";
    }
  }
}
