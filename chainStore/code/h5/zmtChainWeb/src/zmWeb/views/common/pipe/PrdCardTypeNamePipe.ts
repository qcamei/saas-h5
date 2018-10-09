import {Pipe, PipeTransform} from "@angular/core";
import {ZmMap} from "../../../comModule/AppUtils";
import {PrdCardType} from "../../../bsModule/chainCard/data/PrdCardType";

@Pipe({name: 'prdCardTypeNamePipe'})
export class PrdCardTypeNamePipe implements PipeTransform {

  constructor() {
  }

  transform(typeId: number, prdCardTypeMap: ZmMap<PrdCardType>) {
    let target = "";
    if(typeId && prdCardTypeMap){
      let prdCardType:PrdCardType = prdCardTypeMap.get(typeId.toString());
      if(prdCardType){
        target = prdCardType.name;
      }
    }
    return target;
  }
}
