

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'zm-pieAngleCharts',
  template: `
  <div echarts [options]="option"></div>
  `,
})
export class PieAngleEChartsElement implements OnInit {
    public option:any;

  constructor() { }

  ngOnInit() {
  // pieAngle图形
  this.option = {

    tooltip: {
      trigger: 'item',
      // formatter: "{a} <br/>{b} : {d}%"
      // formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    // legend: {
      // orient: 'vertical',
      // left:'left',
    //   bottom:0,
    //   data: ['美容类','烫发','造型设计','身体养生','日用护肤','次卡','月卡']
    // },
    series : [
        {
            name: '身体塑型',
            type: 'pie',
            radius: '65%',
            // roseType: 'angle',
            // label: {
            //   normal: {
            //     formatter: "{b} {d}%"
            //   }
            // },
            data:[
                {value:610, name:'会员'},
                {value:274, name:'散客'},
                {value:300, name:'其他'},
              
              
            ],
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

