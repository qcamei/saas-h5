import {Pipe, PipeTransform} from "@angular/core";
import {ChainDataStatusEnum} from "../../../bsModule/chainDataSyn/data/ChainDataStatusEnum";

@Pipe({ name: 'chainSynStatusPipe' })
export class ChainSynStatusPipe implements PipeTransform {
  transform(status: number): string {
    if(status == ChainDataStatusEnum.HAVE){
      return "已同步";
    }else if(status == ChainDataStatusEnum.NOT_HAVE){
      return "未同步";
    }
  }
}
