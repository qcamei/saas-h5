import {PipeTransform, Pipe} from "@angular/core";
import {OrderTrackStatusEnum} from "../../../bsModule/orderTrack/data/OrderTrackStatusEnum";
import {OrderTrackTypeEnum} from "../../../bsModule/orderTrack/data/OrderTrackTypeEnum";

@Pipe({name:"zmOrderTrackStatusPipe"})
export class ZmOrderTrackStatusPipe implements PipeTransform{
  transform(status: number,type:number): string {
    if(status == OrderTrackStatusEnum.New){
      return "待付款";
    }else if((status == OrderTrackStatusEnum.Pay || status == OrderTrackStatusEnum.Send) && type==OrderTrackTypeEnum.Express){
      return "待收货";
    }else if((status == OrderTrackStatusEnum.Pay || status == OrderTrackStatusEnum.Send) && type==OrderTrackTypeEnum.Prestore){
      return "待提取";
    }else if(status == OrderTrackStatusEnum.Finish){
      return "已完成";
    }else if(status == OrderTrackStatusEnum.Cancel){
      return "已取消";
    }else{
      return "-";
    }
  }
}
