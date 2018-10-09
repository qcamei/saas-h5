import {DataReportQueryForm} from "../../../bsModule/dataReport/apiData/DataReportQueryForm";
import {MemberStatisticsData} from "../../../bsModule/dataReport/apiData/MemberStatisticsData";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {MemberConsumptionData} from "../../../bsModule/dataReport/apiData/MemberConsumptionData";
import {LineEChartsOptionsData} from "../../zmComp/eCharts/lineEcharts/LineEChartsElement";
import {DayData} from "../../../bsModule/dataReport/apiData/DayData";

export class MemberStatisticsViewData {

  queryForm: DataReportQueryForm;

  memberStatisticsData: MemberStatisticsData;

  //查询参数
  minTime: any;

  maxTime: any;
  totalPage: number = 0;
  consumptionList: Array<MemberConsumptionData> = [];
  currConsumptionList: Array<MemberConsumptionData> = [];
  curPage: number = 1;
  consumptionOptions: {};
  originDataOptions: {};
  lineData: LineEChartsOptionsData;
  newMemberAddOptions: LineEChartsOptionsData;//新增会员频次折线图
  newMemberCostTimesOptions: LineEChartsOptionsData;//新增会员消费频次折线图
  newMemberCostAmountOptions: LineEChartsOptionsData;//新增会员消费金额频次折线图
  pageTabIndex: number = 0;
  itemActiveIndex: number = 0;

  constructor() {

  }

  public static newInstance(): MemberStatisticsViewData {
    let target: MemberStatisticsViewData = new MemberStatisticsViewData();
    target.queryForm = new DataReportQueryForm();
    //初始化时间区间
    let date = new Date();
    target.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: 1};
    target.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    target.queryForm.storeId = SessionUtil.getInstance().getStoreId();
    target.memberStatisticsData = new MemberStatisticsData();
    return target;
  }

  public buildOptions() {
    if (!this.memberStatisticsData) {
      return;
    }
    switch (this.pageTabIndex) {
      case 0:
        this.buildMemberStatistic();
        break;
      case 1:
        this.buildNewMemberStatistic();
        break
    }

  }

  private buildMemberStatistic() {
    this.buildConsumptionOptions();
    this.buildAllCostTimesLineOptions();
  }

  private buildNewMemberStatistic() {
    this.buildMemberOriginPieOptions();
    this.buildNewMemberAddOptions();
    this.buildNewMemberCostTimesOptions();
    this.buildNewMemberCostAmountOptions();
  }

  /**
   * 构建会员、散客消费比例Options
   */
  private buildConsumptionOptions() {
    this.consumptionOptions = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {d}%"
      },
      series: [
        {
          name: '消费比例',
          type: 'pie',
          radius: '60%',
          data: [
            {name: "会员", value: this.memberStatisticsData.totalConsumptionTimes},
            {name: "散客", value: this.memberStatisticsData.outSiderConsumptionTimes}],
          itemStyle: {
            emphasis: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  /**
   *构建新增会员来源饼图Options
   */
  private buildMemberOriginPieOptions() {
    let leaguerOrigin = this.memberStatisticsData.leaguerOriginDatas; 
    let originDatas = [];
    leaguerOrigin.forEach(leaguerOriginData => {
      let pieData = {name: leaguerOriginData.originName, value: leaguerOriginData.count};
      originDatas.push(pieData);
    });

    this.originDataOptions = {

      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {d}%"
      },

      series: [
        {
          name: '新增会员来源',
          type: 'pie',
          radius: '60%',
          data: originDatas,
          itemStyle: {
            emphasis: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  /**
   * 构建会员消费频次options
   */
  private buildAllCostTimesLineOptions() {

    this.lineData = this.buildCountLineOptionsData(this.memberStatisticsData.dayDataList, ['会员消费']);
  }

  /**
   * 构建新增会员新增频次optionsData
   */
  private buildNewMemberAddOptions() {

    this.newMemberAddOptions = this.buildCountLineOptionsData(this.memberStatisticsData.newMemberAddDataList, ['新增会员频次']);
  }

  /**
   * 构建新增会员消费频次optionsData
   */
  private buildNewMemberCostTimesOptions() {

    this.newMemberCostTimesOptions = this.buildCountLineOptionsData(this.memberStatisticsData.newMemberCostDataList, ['新增会员消费频次']);
  }

  /**
   * 构建新增会员消费optionsData
   */
  private buildNewMemberCostAmountOptions() {

    this.newMemberCostAmountOptions = this.buildCostLineOptionsData(this.memberStatisticsData.newMemberCostDataList, ['新增会员消费']);
  }


  /**
   * 构建次数optionsData
   */
  private buildCountLineOptionsData(targetDataList: Array<DayData>, legends: Array<string>): LineEChartsOptionsData {
    let xAlis: Array<string> = [];
    let yAlis: Array<string> = [];
    if (targetDataList) {
      targetDataList.map(dayData => {
        xAlis.push(dayData.timeStr);
        yAlis.push(dayData.count.toString());
      });
    }
    return new LineEChartsOptionsData(xAlis, yAlis, legends);
  }

  /**
   * 构建消费optionsData
   */
  private buildCostLineOptionsData(targetDataList: Array<DayData>, legends: Array<string>): LineEChartsOptionsData {
    let xAlis: Array<string> = [];
    let yAlis: Array<string> = [];
    if (targetDataList) {
      targetDataList.map(dayData => {
        // let amount = Number(dayData.amount);
        xAlis.push(dayData.timeStr);
        yAlis.push(dayData.amount);

      });
    }
    return new LineEChartsOptionsData(xAlis, yAlis, legends);
  }

  public setCurrConsumptionList(currConsumptionList: Array<MemberConsumptionData>): void {
    if (currConsumptionList) {
      this.currConsumptionList = currConsumptionList;
      for (let i = 0; i < this.currConsumptionList.length; i++) {
        this.currConsumptionList[i].position = (this.curPage - 1) * 10 + i + 1;
      }
    }

  }
}
