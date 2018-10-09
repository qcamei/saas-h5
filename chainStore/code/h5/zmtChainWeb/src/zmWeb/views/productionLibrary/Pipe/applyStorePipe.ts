import {Pipe, PipeTransform} from "@angular/core";
import {SellProductTypeEnum} from "../../../bsModule/sellProduct/data/SellProductTypeEnum";

@Pipe({name:'applyStorePipe'})
export class ApplyStorePipe implements PipeTransform{
  transform(applyStoreIds:Array<number>){
    if(applyStoreIds && applyStoreIds.length>0){
        return applyStoreIds.length;
      }else {
        return "-";
      }
  }
}


