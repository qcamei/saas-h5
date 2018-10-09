/**
 * 时间段
 */
export class TimeSlot {
  private minTime: number;
  private maxTime: number;


  constructor(minTime: number, maxTime: number) {
    this.minTime = minTime;
    this.maxTime = maxTime;
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
}
