import {TimeSlotEnum} from "../../zmComp/form/date/timeSlot/TimeSlotEnum";

/**
 * @Description
 * @Creator geefox
 * @E-mail firstblh@163.com
 * @Date 2018/9/27
 */
export class CustomerStatisticViewData {
  newMemberCount: number = 0;
  newCostTimes: number = 0;

  public minTime: string;
  public maxTime: string;
  public timeSlotEnums = [TimeSlotEnum.TODAY, TimeSlotEnum.THIS_MONTH, TimeSlotEnum.LAST_MONTH];

  constructor() {

  }

  public static newInstance(): CustomerStatisticViewData {
    return new CustomerStatisticViewData();
  }


}
