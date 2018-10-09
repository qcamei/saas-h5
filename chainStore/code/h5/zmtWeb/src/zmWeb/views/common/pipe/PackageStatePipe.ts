import {Pipe, PipeTransform} from "@angular/core";
import {PackageStateEnum} from "../../../bsModule/storePackageProject/data/PackageStateEnum";

/**
 * 套餐状态枚举-->文字 转换管道
 */

@Pipe({name: 'packageStatePipe'})
export class PackageStatePipe implements PipeTransform {
  transform(state: number): string {
    if (state == PackageStateEnum.Open) {
      return "上架";
    } else if (state == PackageStateEnum.Close) {
      return "下架";
    }
  }
}

@Pipe({name: 'packageStatePipe2'})
export class PackageStatePipe2 implements PipeTransform {
  transform(state: number): string {
    if (state == PackageStateEnum.Open) {
      return "下架";
    } else if (state == PackageStateEnum.Close) {
      return "上架";
    }
  }
}
