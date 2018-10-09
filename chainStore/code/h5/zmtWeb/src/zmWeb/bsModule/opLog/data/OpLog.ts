import {OpLogTypeEnum} from "./OpLogTypeEnum";

export class OpLog {
  id: number;
  storeId: number;
  buserName: string;
  newName: string;
  /**
   * 操作日志类型 {@link OpLogTypeEnum}
   */
  type: number;
  content: string;
  createdTime: number;
  lastUpdateTime: number;
  ver: number;
}
