import {Pipe, PipeTransform} from "@angular/core";
import {ZmMap} from "../../../comModule/AppUtils";
import {Product} from "../../../bsModule/chainProduct/data/Product";


/**
 * 项目ID -->项目名字 转换管道
 * @param prdId: number
 * @param prdInfoMap:ZmMap<ProductInfo>
 * 使用 {{prdId|productNamePipe:prdInfoMap}}
 */
@Pipe({name: 'productNamePipe'})
export class ProductNamePipe implements PipeTransform {

  transform(prdId: number, prdInfoMap: ZmMap<Product>){
    let target = "";
    if(prdId && prdInfoMap){
      let prdInfo = prdInfoMap.get(prdId.toString());
      if (prdInfo) {
        target =  prdInfo.name;
      }
    }
    return target;
  }
}


