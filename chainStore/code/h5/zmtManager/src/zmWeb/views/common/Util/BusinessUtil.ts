

export class BusinessUtil {
  constructor() {
  }

  /**
   * 日历控件转换格式
   * @param {year:2017,month:12,day:20}
   * @return "2017/12/20 00:00:00"
   */
  public static formatMinTime(dateP){
    let arrTmp = [dateP.year,dateP.month,dateP.day];
    let date = new Date(arrTmp.join("/") + " 00:00:00");
    return date.getTime();
  }

  public static formatMaxTime(dateP){
    let arrTmp = [dateP.year,dateP.month,dateP.day];
    let date = new Date(arrTmp.join("/") + " 23:59:59");
    return date.getTime();
  }

  /**
   * 时间戳转日期对象
   * @return {year:2017,month:12,day:20}
   */
  public static formatObject(time:number){
    let date = new Date(time);
    let target = {year:date.getFullYear(),month:date.getMonth()+1,day:date.getDate()};
    return target;
  }

  /**
   * 今日时间
   */
  public static getToDayObject() {
    let date = new Date();
    let objTmp = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    return objTmp;
  }

  /**
   * 对lastUpdateTime进行排序
   * @param listTmp:Array<Object>
   */
  public static sortListObject(listTmp) {
    listTmp = listTmp.sort(function (a, b) {
        if (a.lastUpdateTime > b.lastUpdateTime) {
          return -1;
        } else if (a.lastUpdateTime < b.lastUpdateTime) {
          return 1;
        } else {
          return 0;
        }
      }
    );
    return listTmp;
  }
}




