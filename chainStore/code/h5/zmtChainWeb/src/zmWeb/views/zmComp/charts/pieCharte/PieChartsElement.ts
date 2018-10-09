

import {Component , OnInit,OnChanges,Input} from '@angular/core';

@Component({

  selector:'zm-pieCharts-tool',
  template:`
    <div echarts  [options] = "options"> </div>

  `,

})

export class PieChartsElement {
  private _viewData:any;

  @Input()
  get viewData(): any {
    return this._viewData;
  }

  set viewData(value: any) {
    this._viewData = value;
    this.initChart();
  }

  @Input() tabName:string;

  @Input() public options:any;

  constructor(){

  }

  initChart(){


    // 产品统计使用的pie图标
    this.options = {

      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {d}%"
        // formatter: "{a} <br/>{b} : {c} ({d}%)"
      },

      series : [
        {
          name:this._viewData.name,
          type: 'pie',
          radius: '60%',

          data:this._viewData.data,
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


}
