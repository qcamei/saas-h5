import {PipeTransform, Pipe} from "@angular/core";
import {OrderTrackTypeEnum} from "../../../bsModule/orderTrack/data/OrderTrackTypeEnum";

@Pipe({name:"zmOrderTrackTypePipe"})
export class ZmOrderTrackTypePipe implements PipeTransform{
  transform(type: number): string {
    if(type == OrderTrackTypeEnum.Express){
      return "快递配送";
    }else if(type == OrderTrackTypeEnum.Prestore){
      return "到店自提";
    }else{
      return "-";
    }
  }
}
