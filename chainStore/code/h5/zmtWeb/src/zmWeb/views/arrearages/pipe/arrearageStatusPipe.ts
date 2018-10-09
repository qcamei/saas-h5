import {Pipe, PipeTransform} from "@angular/core";
import {BonusTypeEnum} from "../../../bsModule/bonusRecord/data/BonusTypeEnum";
import {ArrearageStatusEnum} from "../../../bsModule/arrearage/data/ArrearageStatusEnum";

@Pipe({name:"arrearageStatusPipe"})
export class ArrearageStatusPipe implements PipeTransform{
  transform(type: number): string {
    if(type == ArrearageStatusEnum.BALANCE_DUE){
      return "欠款";
    }else if(type == ArrearageStatusEnum.FINISH){
      return "清账";
    }
  }
}
