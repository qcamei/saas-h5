import {MgrPool} from "../../../../comModule/MgrPool";

/**
 * 补单 辅助类
 */
export class OldRecordHelper {

  isOldRecord: boolean = false;//true表示是补单
  orderTime: number = 0;//补单时间

  public static getInstance(): OldRecordHelper {
    return MgrPool.getInstance().get("OldRecordHelper", OldRecordHelper);
  }

  /**
   * 重置和补单相关的字段
   */
  public static reset(): void {
    this.getInstance().isOldRecord = false;
    this.getInstance().orderTime = 0;
  }
}
