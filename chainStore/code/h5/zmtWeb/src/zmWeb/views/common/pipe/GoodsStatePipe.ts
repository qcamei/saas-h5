import {Pipe, PipeTransform} from "@angular/core";
import {GoodsStateEnum} from '../../../bsModule/storeGoods/data/GoodsStateEnum';

@Pipe({ name: 'goodsStatePipe' })
export class GoodsStatePipe implements PipeTransform {
  transform(state: number): string {
    if(state==GoodsStateEnum.Open){
      return "上架";
    }else if(state ==GoodsStateEnum.Close){
      return "下架";
    }
  }
}

@Pipe({ name: 'goodsStatePipe2' })
export class GoodsStatePipe2 implements PipeTransform {
  transform(state: number): string {
    if(state==GoodsStateEnum.Open){
      return "下架";
    }else if(state ==GoodsStateEnum.Close){
      return "上架";
    }
  }
}
