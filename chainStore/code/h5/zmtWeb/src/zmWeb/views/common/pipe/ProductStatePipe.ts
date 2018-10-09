import {Pipe, PipeTransform} from "@angular/core";
import {ProductInfoState} from "../../../bsModule/StoreProductInfo/data/ProductInfoState";

@Pipe({ name: 'productStatePipe' })
export class ProductStatePipe implements PipeTransform {
  transform(state: number): string {
    if(state==ProductInfoState.OPEN){
      return "上架";
    }else if(state ==ProductInfoState.CLOSE){
      return "下架";
    }
  }
}

@Pipe({ name: 'productStatePipe2' })
export class ProductStatePipe2 implements PipeTransform {
  transform(state: number): string {
    if(state==ProductInfoState.OPEN){
      return "下架";
    }else if(state ==ProductInfoState.CLOSE){
      return "上架";
    }
  }
}
