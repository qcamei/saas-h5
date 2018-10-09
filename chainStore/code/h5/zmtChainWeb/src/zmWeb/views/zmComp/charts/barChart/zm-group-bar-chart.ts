import {Component, Input} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {graphic} from 'echarts';


@Component({
  selector: 'zm-group-bar-chart',
  template: `
    <div echarts [options]="options"></div>
  `,
})
export class ZmGroupBarChart {

  private _optionsData: GroupBarChartData;

  @Input()
  public options: {};

  @Input()
  title: string;

  constructor() {

  }

  @Input()
  set optionsData(value: GroupBarChartData) {
    this._optionsData = value;
    this.buildOptionsData();
  }

  /**
   * 构建
   */
  buildOptionsData(): void {
    if (AppUtils.isNullObj(this._optionsData))
      return;
    let axisArray: Array<string> = this._optionsData.axisArray;
    let valueData: Array<BarChartValue> = this._optionsData.valueData;
    let series = [];
    let legendData = [];
    // && axisArray.length == valueData.length
    if (!AppUtils.isNullObj(valueData) && !AppUtils.isNullObj(axisArray)) {
      for (let i: number = 0; i < valueData.length; i++) {
        let barChartValue: BarChartValue = valueData[i];
        legendData.push(barChartValue.title);
        let serie = {
          name: barChartValue.title,
          type: 'bar',
          data: barChartValue.valueData,
          animationDelay: function (idx) {
            return (idx + i) * 10;
          }
        };
        series.push(serie);
      }

    }
    this.options = {
      title: {
        text: this.title
      },
      legend: {
        x: 'right',
        y: 'top',
        data: legendData,
        align: 'right'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        data: axisArray,
        axisLabel: {
          inside: false,
          textStyle: {
            color: '#000'
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        z: 10
      },
      yAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#999'
          }
        }
      },

      series: series,
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
        return idx * 5;
      }
    };
    // dataZoom: [
    //   {
    //     type: 'inside'
    //   }
    // ],

  }


}

export class BarChartValue {
  title: string;
  valueData: Array<string>;


  constructor(title: string, valueData: Array<string>) {
    this.title = title;
    this.valueData = valueData;
  }
}

export class GroupBarChartData {

  axisArray: Array<string>;
  valueData: Array<BarChartValue>;


  constructor(axisArray: Array<string>, valueData: Array<BarChartValue>) {
    this.axisArray = axisArray;
    this.valueData = valueData;
  }

}
