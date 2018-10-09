import {Pipe, PipeTransform} from "@angular/core";
import {ZmMap} from "../../../comModule/AppUtils";
import {Goods} from "../../../bsModule/chainGoods/data/Goods";


/**
 * 商品ID -->商品名字 转换管道
 * @param goodsId: number
 * @param goodsMap:ZmMap<Goods>
 * 使用 {{goodsId|goodsNamePipe:goodsMap}}
 */
@Pipe({name: 'goodsNamePipe'})
export class GoodsNamePipe implements PipeTransform {

  transform(goodsId: number, goodsMap: ZmMap<Goods>) {
    let target = "";
    if(goodsId && goodsMap){
      let goods = goodsMap.get(goodsId.toString());
      if (goods) {
        target= goods.name;
      }
    }
    return target;

  }
}


