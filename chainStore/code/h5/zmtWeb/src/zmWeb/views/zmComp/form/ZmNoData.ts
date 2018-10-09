import { Component,Input,} from "@angular/core";
// 2018.3.2
// <no-data [loadingFinish]="viewData.loadingFinish" [dataList]="viewData.prdInfoListShow" [text]="没有数据" [showImg]="'noData'"></no-data>-->
@Component({
  selector:'no-data',
  template:
    `
    <div class="">
        <div *ngIf="loadingFinish && dataList.length == 0" class="text-center disFlex hor-center align-center "
             style="border: 1px solid #e9ecef;border-top: none;height: calc(100vh - 350px);">
          <div style="">
            <img src="assets/images/{{showImg}}.png" height="220" width="220"/>
            <h4 class="font-bold fz-18">{{text}}</h4>
          </div>
        </div>
    </div>
   `,
  styles:[`
  .text-center{
    text-align: center;
  }
  .font-bold{
    font-weight: bold;
  } 
  .fz-18{
    font-size: 18px;
  }
  .disFlex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: -moz-box;
    display: flex;
  }
  .flex {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    -webkit-flex: 1;
       -moz-box-flex: 1;
            flex: 1;
  }
  .align-center {
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -moz-box-align: center;
    align-items: center;
  }
  
  .hor-center {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    -moz-box-pack: center;
    justify-content: center;
  }
  `]
})
export class ZmNoData{

  @Input() loadingFinish;
  @Input() dataList;
  @Input() showImg;
  @Input() text:string;
  constructor(){}

}
