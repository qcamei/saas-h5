import {PipeTransform, Pipe} from "@angular/core";

@Pipe({name:"buserVipTypePipe"})
export class BuserVipTypePipe implements PipeTransform{
  transform(vipType: number): string {
    if(vipType == 0){
      return "体验会员";
    }else if(vipType == 1){
      return "内测会员";
    }else if(vipType == 2){
      return "白银会员";
    }else if(vipType == 3){
      return "黄金会员";
    }else if(vipType == 4){
      return "钻石会员";
    }else if(vipType == 5){
      return "宏强定制会员";
    }else if(vipType == 6){
      return "标准会员";
    }else{
      return "标准会员";
    }
  }
}
