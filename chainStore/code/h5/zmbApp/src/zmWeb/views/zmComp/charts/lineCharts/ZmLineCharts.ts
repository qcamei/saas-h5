import {Component, Input, OnInit} from '@angular/core';
import {AppUtils} from "../../../../comModule/AppUtils";


@Component({
  selector: 'zm-line-charts',
  template: `
    <div echarts [options]="option"></div>
  `,
})
export class ZmLineCharts implements OnInit {


  private _optionsData: LineEChartsOptionsData;


  ngOnInit(): void {
  }

  @Input()
  public option: {};

  constructor() {
  }

  @Input()
  set optionsData(value: LineEChartsOptionsData) {
    if (AppUtils.isNullObj(value))
      return;
    this._optionsData = value;
    let xAlis: Array<string> = value.xAlis;
    let yAlis: Array<string> = value.yAlis;
    let legends = value.legends;
    let tempOptions = {
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
        data: legends
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
          name: legends[0],
          type: 'line',
          stack: 'counts',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          data: yAlis
        },


      ]
    };
    this.option = tempOptions;

  }


}

export class LineEChartsOptionsData {
  legends: Array<string>;
  xAlis: Array<string> = [];
  yAlis: Array<string> = [];

  constructor(xAlis: Array<string>, yAlis: Array<string>, legends: Array<string>) {
    this.xAlis = xAlis;
    this.yAlis = yAlis;
    this.legends = legends;
  }


}

