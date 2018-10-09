import {Pipe, PipeTransform} from "@angular/core";
import {ZmMap} from "../../../comModule/AppUtils";
import {GoodsType} from "../../../bsModule/chainGoods/data/GoodsType";

@Pipe({ name: 'goodsTypePipe' })
export class GoodsTypePipe implements PipeTransform {

  constructor() {}

  transform(typeId:number,goodsTypeMap:ZmMap<GoodsType>){
    let target = "";
    if(typeId && goodsTypeMap){
      let goodsType:GoodsType = goodsTypeMap.get(typeId.toString());
      if(goodsType){
        target = goodsType.name;
      }
    }
    return target;
  }
}
