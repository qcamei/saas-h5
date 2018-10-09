import {Pipe, PipeTransform} from "@angular/core";
import {ZmMap} from "../../../comModule/AppUtils";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";

@Pipe({name: 'productTypePipe'})
export class ProductTypePipe implements PipeTransform {

  constructor() {
  }

  transform(typeId: number, productTypeMap: ZmMap<ProductType>) {
    let target = "";
    if(typeId && productTypeMap){
      let productType:ProductType = productTypeMap.get(typeId.toString());
      if(productType){
        target = productType.name;
      }
    }
    return target;
  }
}
