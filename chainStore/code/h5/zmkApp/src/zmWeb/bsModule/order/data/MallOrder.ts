import {Order} from "./Order";
export class MallOrder {
  constructor() {
  }

  order: Order;
  trackStatus: number;
  //快递信息OrderTrackTypeEnum
  type: number;
}
