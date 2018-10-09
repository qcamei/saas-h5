import {PipeTransform, Pipe} from "@angular/core";
import {ZmMap} from "../../../comModule/AppUtils";
import {GoodsType} from "../../../bsModule/storeGoods/data/GoodsType";
import {BuserRoleBonusInfo} from "../../../bsModule/bonusRecord/data/BonusRecordDataHelper";

@Pipe({name:"rolePipeComp"})
export class RolePipeComp implements PipeTransform{

  transform(buserId: string, buserRoleBonusInfoMap:ZmMap<BuserRoleBonusInfo>): string {
    return buserRoleBonusInfoMap.get(buserId)?buserRoleBonusInfoMap.get(buserId).roleName:"-";
  }
}
