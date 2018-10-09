

import { Component, OnInit,Input } from '@angular/core';
import {FrequencyOfConsumptionLineData} from "../../../../bsModule/memberStatistics/data/FrequencyOfConsumptionLineData";

@Component({
  selector: 'zzl-line-Echarts',
  template: `
  <div echarts [options]="option"></div>
  `,
})
export class ZZLECharts {
  public option:any;

  private _viewData:FrequencyOfConsumptionLineData = new FrequencyOfConsumptionLineData();

  @Input()
  get viewData():FrequencyOfConsumptionLineData{
    return this._viewData;
  }

  set viewData(value:FrequencyOfConsumptionLineData){
    console.log("aaaa");
    console.log(this._viewData.title);
    this._viewData = value;
    this.initChart();
  }

  constructor() { }


  initChart(){
    this.option = {
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
        data: [this._viewData.title]
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
          data:this._viewData.timeList
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: [],
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
          data:this._viewData.dataLsit
        },


      ]
    };


  }


}

