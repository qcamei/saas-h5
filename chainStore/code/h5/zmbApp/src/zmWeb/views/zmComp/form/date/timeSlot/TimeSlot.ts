/**
 * 时间段
 */
export class TimeSlot {
  private minTime: number;
  private maxTime: number;
  private timeSlotEnum:number;

  constructor(minTimeP: number, maxTimeP: number,timeSlotEnumP:number) {
    this.minTime = minTimeP;
    this.maxTime = maxTimeP;
    this.timeSlotEnum = timeSlotEnumP;
  }

  getMinTime(): number {
    return this.minTime;
  }

  setMinTime(value: number) {
    this.minTime = value;
  }

  getMaxTime(): number {
    return this.maxTime;
  }

  setMaxTime(value: number) {
    this.maxTime = value;
  }

  getTimeSlotEnum(): number {
    return this.timeSlotEnum;
  }

  setTimeSlotEnum(value: number) {
    this.timeSlotEnum = value;
  }
}
