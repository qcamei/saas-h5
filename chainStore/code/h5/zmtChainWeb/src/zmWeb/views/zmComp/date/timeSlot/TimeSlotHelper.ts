/**
 * 时间段辅助类
 */
import {TimeSlot} from "./TimeSlot";
import {TimeSlotEnum} from "./TimeSlotEnum";
import {Constants} from "../../../common/Util/Constants";
import {DateWrap} from "./DateWrap";

export class TimeSlotHelper {

  constructor() {
  }

  /**
   * 根据枚举获取其对应的Label
   * @param {TimeSlotEnum} timeSlotEnum
   * @returns {string}
   */
  public static getLabelByEnum(timeSlotEnum: TimeSlotEnum): string {
    let label: string;
    switch (timeSlotEnum) {
      case TimeSlotEnum.LAST_MONTH:
        label = "上个月";
        break;
      case TimeSlotEnum.LAST_SEVEN_DAYS:
        label = "七天内";
        break;
      case TimeSlotEnum.YESTERDAY:
        label = "昨日";
        break;
      case TimeSlotEnum.TODAY:
        label = "今日";
        break;
      case TimeSlotEnum.TOMORROW:
        label = "明日";
        break;
      case TimeSlotEnum.NEXT_SEVEN_DAYS:
        label = "七天内";
        break;
      case TimeSlotEnum.THIS_MONTH:
        label = "本月";
        break;
    }
    return label;
  }

  /**
   * 根据枚举获取 TimeSlot
   * @param {TimeSlotEnum} timeSlotEnum
   * @returns {TimeSlot}
   */
  public static getTimeSlotByEnum(timeSlotEnum: TimeSlotEnum): TimeSlot {
    let maxTimeStamp: number;//最大时间戳
    let minTimeStamp: number;//最小时间戳
    let curTime = this.getCurTime();
    switch (timeSlotEnum) {
      case TimeSlotEnum.LAST_MONTH:
        maxTimeStamp = this.getMinTimeInMonth(curTime) - 1;
        minTimeStamp = this.getMinTimeInMonth(this.toDate(maxTimeStamp));
        break;
      case TimeSlotEnum.LAST_SEVEN_DAYS:
        maxTimeStamp = this.getMaxTimeInday(curTime);
        minTimeStamp = this.getMinTimeInday(this.toDate(curTime.getTime() - Constants.ONEDAY_TIMESTAMP * 6));
        break;
      case TimeSlotEnum.YESTERDAY:
        maxTimeStamp = this.getMinTimeInday(curTime) - 1;
        minTimeStamp = this.getMinTimeInday(this.toDate(curTime.getTime() - Constants.ONEDAY_TIMESTAMP * 1));
        break;
      case TimeSlotEnum.TODAY:
        maxTimeStamp = this.getMaxTimeInday(curTime);
        minTimeStamp = this.getMinTimeInday(curTime);
        break;
      case TimeSlotEnum.TOMORROW:
        maxTimeStamp = this.getMaxTimeInday(curTime) + Constants.ONEDAY_TIMESTAMP;
        minTimeStamp = this.getMinTimeInday(curTime) + Constants.ONEDAY_TIMESTAMP;
        break;
      case TimeSlotEnum.NEXT_SEVEN_DAYS:
        minTimeStamp = this.getMinTimeInday(curTime);
        maxTimeStamp = this.getMaxTimeInday(this.toDate(curTime.getTime() + Constants.ONEDAY_TIMESTAMP * 6));
        break;
      case TimeSlotEnum.THIS_MONTH:
        let nextMonth: Date = this.getNextMonth(curTime);
        maxTimeStamp = this.getMinTimeInMonth(nextMonth) - 1;
        minTimeStamp = this.getMinTimeInMonth(curTime);
        break;
      default:
        return null;
    }
    let timeSlot: TimeSlot = new TimeSlot(minTimeStamp, maxTimeStamp);
    return timeSlot;
  }

  /**
   * 获取下一月
   * @param date
   * @returns {Date}
   */
  private static getNextMonth(date: Date) {
    let fullYear: number = date.getFullYear();
    let month: number = date.getMonth();
    let day = 1;
    if ((month + 1) > 11) {
      fullYear = fullYear + 1;
      month = 1;
    } else {
      month = month + 1;
    }
    let nextMonth: Date = new Date(fullYear, month, day, 0, 0, 0, 0);
    return nextMonth;
  }

  /**
   * 获取当天最小时间戳
   * @returns {number}
   */
  private static getMinTimeInday(date: Date): number {
    //当天 最小的时间戳
    date.setHours(0, 0, 0, 0);
    let minTimeStamp: number = date.getTime();
    return minTimeStamp;
  }

  /**
   * 获取当天最大时间戳
   * @returns {number}
   */
  private static getMaxTimeInday(date: Date): number {
    //当天 最大的时间戳
    date.setHours(23, 59, 59, 0);
    let maxTimeStamp: number = date.getTime();
    return maxTimeStamp;
  }

  /**
   * 获取本月中的最小时间戳
   * @param {Date} date
   * @returns {number}
   */
  private static getMinTimeInMonth(date: Date): number {
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    let minTimeStamp: number = date.getTime();
    return minTimeStamp;
  }

  /**
   * 获取当前时间
   * @returns {Date}
   */
  private static getCurTime(): Date {
    let now: Date = new Date();
    return now;
  }

  /**
   * 根据时间戳转为Date
   * @param {number} timeStamp
   * @returns {Date}
   */
  private static toDate(timeStamp: number): Date {
    let date: Date = new Date(timeStamp);
    return date;
  }

  /**
   * 根据 时间戳 获取 DateWrap
   * @param {number} timeStamp 时间戳
   * @returns {DateWrap}
   */
  public static getDateWrapByTimeSlot(timeStamp: number): DateWrap {
    let date: Date = this.toDate(timeStamp);
    return new DateWrap(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  /**
   * 根据 DateWrap 获取 当天最大 时间戳
   * @param {number} timeStamp 时间戳
   * @returns {DateWrap}
   */
  public static getMaxTimeStampByDateWrap(dateWrap: DateWrap): number {
    let date: Date = new Date(dateWrap.year, dateWrap.month - 1, dateWrap.day);
    return this.getMaxTimeInday(date);
  }

  /**
   * 根据 DateWrap 获取 当天最小 时间戳
   * @param {number} timeStamp 时间戳
   * @returns {DateWrap}
   */
  public static getMinTimeStampByDateWrap(dateWrap: DateWrap): number {
    let date: Date = new Date(dateWrap.year, dateWrap.month - 1, dateWrap.day);
    return this.getMinTimeInday(date);
  }
}
