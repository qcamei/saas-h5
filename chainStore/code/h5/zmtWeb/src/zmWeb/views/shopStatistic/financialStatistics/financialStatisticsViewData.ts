import {DataReportQueryForm} from "../../../bsModule/dataReport/apiData/DataReportQueryForm";
import {FinanceReport} from "../../../bsModule/dataReport/apiData/FinanceReport";
import {SessionUtil} from "../../../comModule/session/SessionUtil";

export class FinancialStatisticsViewData {

  queryForm: DataReportQueryForm;

  financeReport: FinanceReport;

  //查询参数
  public minTime: any;
  public maxTime: any;

  storeId: string;

  options: any;

  loadingFinish: boolean = false;


  public static newInstance(): FinancialStatisticsViewData {
    let target: FinancialStatisticsViewData = new FinancialStatisticsViewData();
    target.queryForm = new DataReportQueryForm();
    //初始化时间区间
    let date = new Date();
    target.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    target.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    target.queryForm.storeId = SessionUtil.getInstance().getStoreId();
    target.financeReport = new FinanceReport();
    return target;
  }


  public buildViewData() {
    if (!this.financeReport)
      return;
    for (let i = 0; i < this.financeReport.payItemDetails.length; i++) {
      this.financeReport.payItemDetails[i].position = i + 1;
    }


    let xAlis: Array<string> = [];
    let yAlis: Array<string> = [];
    if (this.financeReport.dayDataList) {
      this.financeReport.dayDataList.map(dayData => {
        let amount = Number(dayData.amount);
        if(amount>0){
          xAlis.push(dayData.timeStr);
          yAlis.push(dayData.amount);
        }

        // if (dayData.amount == "0.00") {
        //   yAlis.push('0');
        // } else {
        //   yAlis.push(dayData.amount);
        // }
      });

    }
    let options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['营业额']
      },
      grid: {
        left: '1%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: '',
          boundaryGap: true,
          data: xAlis
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '营业额',
          type: 'line',
          stack: 'counts',
          // color:'#F66D16',
          label: {
            normal: {
              // color:'red',
              show: true,
              position: 'top'
            }
          },
          // areaStyle: { normal: {} },
          data: yAlis
        },


      ]
    };
    this.options = options;
  }


  public buildTodayQueryForm() {
    let date = new Date();
    this.minTime = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
    this.maxTime = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  public buildYesterdayQueryForm() {
    let date = new Date();
    let timeY = date.getTime() - 1000 * 60 * 60 * 24;
    let dateY = new Date(timeY);
    this.minTime = {year: dateY.getFullYear(), month: dateY.getMonth() + 1, day: dateY.getDate()};
    this.maxTime = {year: dateY.getFullYear(), month: dateY.getMonth() + 1, day: dateY.getDate()};
  }

  public buildCurrMonthQueryForm() {
    let date = new Date();
    this.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: 1};
    this.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
  }

  public buildLastMonthQueryForm() {
    let date = new Date();
    let day = date.getDate();
    let lastMonthTime = date.getTime() - 1000 * 60 * 60 * 24 * day;
    let lastMonthDate = new Date(lastMonthTime);
    this.minTime = {year: lastMonthDate.getFullYear(), month: lastMonthDate.getMonth() + 1, day: 1};
    this.maxTime = {
      year: lastMonthDate.getFullYear(),
      month: lastMonthDate.getMonth() + 1,
      day: lastMonthDate.getDate()
    };
  }


  public log() {
    // console.log(this.minTime);
    // console.log(this.maxTime);
  }
}
